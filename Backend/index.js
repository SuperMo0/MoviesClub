import express from 'express'
import authRouter from './Routes/auth.router.js'


const app = express();

app.use(express.json());


app.use('/api/auth', authRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port${PORT}`);
})