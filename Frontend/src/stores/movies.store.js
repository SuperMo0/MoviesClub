import api from "@/lib/axios";
import { create } from "zustand";

export const useMoviesStore = create((set, get) => ({

    allMovies: null,

    todayMovies: null,

    // getAllMovies: async function () {
    //     if (get().allMovies) return;

    //     let allMovies = new Map();
    //     let result = await api.get('/movies');

    //     let movies = result.data.movies;

    //     movies.forEach(m => {
    //         allMovies.set(m.id, m);
    //     })
    //     set({ allMovies });
    // },

    getTodayMovie: async function () {
        if (get().todayMovies) return;
        let todayMovies = new Map();

        let result = await api.get('/movies/today');

        let movies = result.data.movies;

        movies.forEach(m => {
            todayMovies.set(m.id, m);
        })
        set({ todayMovies });
    }

}))