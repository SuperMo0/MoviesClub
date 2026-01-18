import { Router } from "express";
import * as controller from '../controllers/movies.controller.js'

const router = Router();


router.get('/', controller.getAllMovies);

router.get('/today', controller.getTodayMovies);


export default router


