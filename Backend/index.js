import 'dotenv/config'
import express from 'express'
import authRouter from './Routes/auth.router.js'
import socialRouter from './Routes/social.router.js'
import moviesRouter from './Routes/movies.router.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port${PORT}`);
})