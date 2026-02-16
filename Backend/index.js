import 'dotenv/config'
import express from 'express'
import authRouter from './Routes/auth.router.js'
import socialRouter from './Routes/social.router.js'
import moviesRouter from './Routes/movies.router.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { start } from './utils/fetchMovies.js'
import cron from 'node-cron';
import path from 'path'


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(cookieParser());

app.use(express.json());


app.use('/api/auth', authRouter);

app.use('/api/social', socialRouter);

app.use('/api/movies', moviesRouter);

app.use((err, req, res, next) => {
    return res.status(500).json({ message: err });
})

const PORT = process.env.PORT || 3000;



if (process.env.NODE_ENV != 'development') {
    const staticPath = path.join(process.cwd(), '..', 'Frontend/dist');

    app.use(express.static(path.join(staticPath)));

    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.join(staticPath, '/index.html'));
    })
}

app.listen(PORT, async () => {
    console.log(`server running on port ${PORT}`);

    if (process.env.NODE_ENV != 'development') await start();

    cron.schedule('0 3 * * *', async () => {
        console.log("Running daily update...");
        await start();
    });
});