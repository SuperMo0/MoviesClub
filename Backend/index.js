import 'dotenv/config'
import express from 'express'
import authRouter from './Routes/auth.router.js'
import socialRouter from './Routes/social.router.js'
import moviesRouter from './Routes/movies.router.js'


const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/social', socialRouter);

app.use('/api/movies', moviesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port${PORT}`);
})