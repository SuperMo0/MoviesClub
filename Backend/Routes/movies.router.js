import { Router } from "express";
import * as controller from '../controllers/movies.controller.js'

const router = Router();

router.get('/', controller.getTodayMovies);


export default router


