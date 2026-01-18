import React, { useEffect, useState } from 'react'
import Footer from '@/MoviesComponents/Footer'
import Hero from '@/MoviesComponents/Hero'
import Qsearch from '@/MoviesComponents/Qsearch'
import ShowingNow from '@/MoviesComponents/ShowingNow'
import MovieBookingModal from '@/MoviesComponents/MovieBookingModal'
import Login from '@/SocialComponents/Login'
import { useMoviesStore } from '@/stores/movies.store'

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMovie, setActiveMovie] = useState(null);

    const { getTodayMovie, todayMovies } = useMoviesStore();


    useEffect(() => {

        getTodayMovie();

    }, [])
    function handleMovieClick(movie) {
        setActiveMovie(movie);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    if (!todayMovies) return 'loading...'

    return (
        <div className="relative min-h-screen bg-slate-950"> {/* Added basic background */}
            <MovieBookingModal
                isModalOpen={isModalOpen}
                movie={activeMovie}
                closeModal={closeModal}
            />
            <Hero handleMovieClick={handleMovieClick} />  {/*This Component is heavy my fans are going crazy !*/}
            {/* <Qsearch /> */}
            <ShowingNow handleMovieClick={handleMovieClick} />
            <Footer />
        </div>
    )
}