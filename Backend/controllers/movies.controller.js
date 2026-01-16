
import fs from 'fs'

export async function getTodayMovies(req, res) {
    try {
        let movies = JSON.parse(fs.readFileSync('movies.json'));
        res.json({ movies })
    } catch (error) {

        console.log(error);
        next(error);
    }

}