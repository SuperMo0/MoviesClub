import api from "@/lib/axios";
import { create } from "zustand";
// import movies from '@/movies.js'

export const useMoviesStore = create((set, get) => ({

    allMovies: null,

    todayMovies: null,

    getAllMovies: async function () {

        let allMovies = new Map();
        let result = await api.get('/movies');

        let movies = result.data.movies;
        movies.forEach(m => {
            allMovies.set(m.id, m);
        })
        set({ allMovies });
        set({ todayMovies: allMovies });
    }

}))