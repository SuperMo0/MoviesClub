import { prisma } from './../lib/prisma.js'
import bcrypt from 'bcrypt';

async function main() {
    console.log('🌱 Starting seed...');

    // 1. CLEANUP: Delete existing data
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Database cleaned.');

    // 2. PASSWORD HASHING
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 3. CREATE USERS
    const userSarah = await prisma.user.create({
        data: {
            userName: 'sarah_movies',
            name: 'Sarah Jenkins',
            password: hashedPassword,
            image: 'https://i.pravatar.cc/150?u=sarah',
            bio: 'Cinema addict 🍿 | Sci-Fi lover. "Movies touch our hearts and awaken our vision."',
            joinedAt: new Date('2023-01-15'),
        },
    });

    const userMike = await prisma.user.create({
        data: {
            userName: 'mike_critic',
            name: 'Mike Ross',
            password: hashedPassword,
            image: 'https://i.pravatar.cc/150?u=mike',
            bio: 'Honest reviews only. If the script is bad, I will say it. 📉',
            joinedAt: new Date('2023-03-10'),
        },
    });

    const userEmily = await prisma.user.create({
        data: {
            userName: 'emily_b',
            name: 'Emily Blunt',
            password: hashedPassword,
            image: 'https://i.pravatar.cc/150?u=emily',
            bio: 'Just here for the popcorn and vibes ✨. Rom-com enthusiast.',
            joinedAt: new Date('2023-06-22'),
        },
    });

    const userDave = await prisma.user.create({
        data: {
            userName: 'dave_directs',
            name: 'David Chen',
            password: hashedPassword,
            image: 'https://i.pravatar.cc/150?u=dave',
            bio: 'Filmmaker & Editor 🎥 | Obsessed with cinematography and lighting.',
            joinedAt: new Date('2023-08-05'),
        },
    });

    console.log('👥 Users created.');

    // 4. CREATE GENRES
    const genres = ['Sci-Fi', 'Action', 'Drama', 'Comedy', 'Thriller', 'Romance'];
    const genreMap = {};

    for (const g of genres) {
        const created = await prisma.genre.create({ data: { name: g } });
        genreMap[g] = created.id;
    }

    // 5. CREATE MOVIES
    const dune = await prisma.movie.create({
        data: {
            title: 'Dune: Part Two',
            sourceId: '693134',
            description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
            image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
            genres: { connect: [{ id: genreMap['Sci-Fi'] }, { id: genreMap['Action'] }] },
        },
    });

    const oppenheimer = await prisma.movie.create({
        data: {
            title: 'Oppenheimer',
            sourceId: '872585',
            description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
            image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
            genres: { connect: [{ id: genreMap['Drama'] }, { id: genreMap['Thriller'] }] },
        },
    });

    const barbie = await prisma.movie.create({
        data: {
            title: 'Barbie',
            sourceId: '346698',
            description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.',
            image: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xf8gc2484GyOTnz.jpg',
            genres: { connect: [{ id: genreMap['Comedy'] }, { id: genreMap['Romance'] }] },
        },
    });

    const inception = await prisma.movie.create({
        data: {
            title: 'Inception',
            sourceId: '27205',
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            image: 'https://image.tmdb.org/t/p/w500/9gk7admal4zlE0k0K323Z142hM.jpg',
            genres: { connect: [{ id: genreMap['Sci-Fi'] }, { id: genreMap['Action'] }] },
        },
    });

    console.log('🎬 Movies created.');

    // 6. CREATE POSTS (With Images!)

    // Post 1: Sarah Reviews Inception (Has Image)
    const post1 = await prisma.post.create({
        data: {
            content: 'Just watched Inception again. Still blows my mind how Nolan handled the dream layers. Does anyone else think the top definitely fell at the end?',
            image: 'https://miro.medium.com/v2/resize:fit:1400/1*m_C8X-tV4-32d_ZJ6i_gqA.jpeg', // Spinning top image
            rating: 5,
            authorId: userSarah.id,
            movieId: inception.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
    });

    // Post 2: Mike Reviews Barbie (Text Only)
    const post2 = await prisma.post.create({
        data: {
            content: 'The production design is incredible, but the third act felt a bit preachy. Ryan Gosling stole the show though.',
            image: null, // No image
            rating: 3,
            authorId: userMike.id,
            movieId: barbie.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        },
    });

    // Post 3: Dave Discusses Oppenheimer (Text Only)
    const post3 = await prisma.post.create({
        data: {
            content: 'The use of IMAX cameras in the interrogation scenes created such a claustrophobic feeling. Masterclass in cinematography.',
            image: null,
            rating: null,
            authorId: userDave.id,
            movieId: oppenheimer.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
    });

    // Post 4: Emily Reviews Dune (Has Image)
    const post4 = await prisma.post.create({
        data: {
            content: 'Lisan al Gaib! This was the greatest cinematic experience of my life.',
            image: 'https://images.tubs.tuner-site.com/media/2024/02/dune-part-two-review-denis-villeneuve-timothee-chalamet-zendaya.jpg', // Dune worm scene
            rating: 5,
            authorId: userEmily.id,
            movieId: dune.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        },
    });

    console.log('📝 Posts created.');

    // 7. CREATE INTERACTIONS 

    // -- Comments --
    await prisma.comment.create({
        data: {
            content: 'It definitely wobbled! He is awake.',
            authorId: userMike.id,
            postId: post1.id,
        },
    });

    await prisma.comment.create({
        data: {
            content: 'I agree, Gosling was hilarious.',
            authorId: userSarah.id,
            postId: post2.id,
        },
    });

    // -- Likes --
    await prisma.post.update({
        where: { id: post1.id },
        data: {
            likedBy: {
                connect: [{ id: userMike.id }, { id: userEmily.id }, { id: userDave.id }],
            },
        },
    });

    // -- Follows --
    await prisma.user.update({
        where: { id: userSarah.id },
        data: { following: { connect: [{ id: userMike.id }, { id: userDave.id }] } },
    });

    await prisma.user.update({
        where: { id: userMike.id },
        data: { following: { connect: [{ id: userSarah.id }] } },
    });

    // -- Watchlist --
    await prisma.user.update({
        where: { id: userSarah.id },
        data: { watchList: { connect: [{ id: oppenheimer.id }, { id: barbie.id }] } },
    });

    console.log('❤️ Interactions created.');
    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });