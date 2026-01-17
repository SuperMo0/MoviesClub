import fs from 'fs'
import { differenceInHours } from 'date-fns'
import { prisma } from './../lib/prisma.js'

export async function getTodayMovies(req, res) {

    try {
        let movies = await prisma.movie.findMany({
            include: {
                genres: true,
            }
        })
        res.json({ movies })
    } catch (error) {

        console.log(error);
        next(error);
    }

}

export async function getAllMovies(req, res) {
    try {
        let movies = prisma.movie.findMany({
            include: {
                genres: true,
            }
        })
        res.json({ movies })
    } catch (error) {

        console.log(error);
        next(error);
    }

}