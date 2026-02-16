import * as cheerio from 'cheerio';
import fs from 'fs';
import axios from 'axios';
import { prisma } from './../lib/prisma.js';

const HEADERS = {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://elcinema.com/',
    'X-Requested-With': 'XMLHttpRequest'
};

const base = 'https://elcinema.com';

function shouldFetch() {
    try {
        const today = new Date().toLocaleDateString('en-CA');

        if (!fs.existsSync('lastDataUpdate.json')) return true;

        let data = fs.readFileSync('lastDataUpdate.json', 'utf-8');
        data = JSON.parse(data);

        if (data.date === today) {
            console.log('Movies are up to date.');
            return false;
        }
        return true;
    } catch (error) {
        console.log("Error checking date, forcing update:", error.message);
        return true;
    }
}

function getPageMovies(page, moviesArray) {
    const $ = cheerio.load(page);
    const moviesTable = $('div.row[id^=w]');

    moviesTable.each((i, e) => {
        let id = e.attribs.id.slice(1);
        let image = $(e).find('> div:eq(0)').find('img').prop('attribs')['data-src'];
        let title = $(e).find('> div:eq(1)').find('h3').text().trim();
        let description = $(e).find('> div:eq(2) p:eq(1)').text().trim();

        let genre = $(e).find('> div:eq(2)>ul:eq(1)').children('li').map((i, el) => {
            if (i == 0) return null;
            return $(el).text().trim();
        }).get();

        moviesArray.push({ id, image, title, description, genre });
    });
}

function getPages(page) {
    const $ = cheerio.load(page);
    let pagination = $('ul.pagination>li').not('.arrow').map((i, el) => {
        return $(el).find('a').prop('href');
    }).get();

    return pagination;
}

export async function start() {
    console.log('Starting Scraper');

    if (!shouldFetch()) return;

    let movies = [];
    let today = new Date().toLocaleDateString('en-CA');

    try {

        let response = await axios.get('https://elcinema.com/en/now', { headers: HEADERS });
        let mainPage = response.data;

        getPageMovies(mainPage, movies);

        let links = getPages(mainPage);
        for (let link of links) {
            try {
                if (!link) continue;
                let res = await axios.get(base + link, { headers: HEADERS });
                getPageMovies(res.data, movies);
            } catch (error) {
                console.log(`Error fetching page ${link}:`, error.message);
            }
        }

        console.log(`Found ${movies.length} movies. Syncing DB...`);
        // for (let movie of movies) {
        //     try {
        //         await prisma.movie.upsert({
        //             where: { sourceId: movie.id },
        //             update: {

        //                 image: movie.image,
        //                 description: movie.description
        //             },
        //             create: {
        //                 title: movie.title,
        //                 sourceId: movie.id,
        //                 image: movie.image,
        //                 description: movie.description,
        //                 genres: {
        //                     connectOrCreate: movie.genre.map((g) => ({
        //                         where: { name: g },
        //                         create: { name: g },
        //                     })),
        //                 }
        //             }
        //         });
        //     } catch (error) {
        //         console.log(`DB Error on ${movie.title}:`, error.message);
        //     }
        // }

        await scrapeShowtimes(movies);

        fs.writeFileSync('data.json', JSON.stringify(movies));
        fs.writeFileSync('lastDataUpdate.json', JSON.stringify({ date: today }));

        console.log('--- Scraper Finished Successfully ---');

    } catch (error) {
        console.error('Fatal Scraper Error:', error);
    }
}

async function scrapeShowtimes(movies) {
    console.log("Scraping Showtimes...");
    for (const movie of movies) {
        const url = `${base}/en/work/${movie.id}/theater/eg`;
        movie.schedule = [];

        try {
            const response = await axios.get(url, { headers: HEADERS });
            const $ = cheerio.load(response.data);

            $('.tabs-content .content').each((i, contentDiv) => {
                const divId = $(contentDiv).attr('id');
                if (divId && divId.startsWith('wtheater')) {
                    const rawDate = divId.replace('wtheater', '');
                    const formattedDate = `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`;

                    const dayEntry = { date: formattedDate, cinemas: [] };

                    $(contentDiv).find('.row').each((j, row) => {
                        const cinemaAnchor = $(row).find('.columns.large-4 a').not('.minimize').first();
                        const cinemaName = cinemaAnchor.text().trim();

                        if (cinemaName) {
                            const timesList = [];
                            $(row).find('.columns.large-6 ul.list-separator li').each((k, li) => {
                                const timeText = $(li).text().trim();
                                if (timeText && !timeText.includes('More')) {
                                    timesList.push(timeText);
                                }
                            });
                            if (timesList.length > 0) {
                                dayEntry.cinemas.push({ name: cinemaName, times: timesList });
                            }
                        }
                    });

                    if (dayEntry.cinemas.length > 0) movie.schedule.push(dayEntry);
                }
            });
            console.log(`Scraped schedule for: ${movie.title}`);
        } catch (err) {
            console.log(`Skipping schedule for ${movie.title}: ${err.message}`);
        }
        await new Promise(r => setTimeout(r, 500));
    }
}