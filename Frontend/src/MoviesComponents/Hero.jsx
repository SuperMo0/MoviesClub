import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import MovieHeroCard from './MovieHeroCard'
import { movies } from '../movies.js'
import Autoplay from "embla-carousel-autoplay"

export default function Hero() {
    const [api, setApi] = useState();

    function handleInteraction() {
        if (!api) return;
        console.log(api.plugins().autoplay.stop());

    }
    return (
        <div>
            <Carousel opts={{ loop: true }} setApi={setApi} plugins={[
                Autoplay({
                    delay: 2000,
                    stopOnInteraction: true,
                }),

            ]}>
                <CarouselContent>
                    <CarouselItem > <MovieHeroCard movie={movies[0]} /> </CarouselItem>
                    <CarouselItem><MovieHeroCard movie={movies[1]} /></CarouselItem>
                    <CarouselItem><MovieHeroCard movie={movies[2]} /></CarouselItem>
                </CarouselContent>

                <div onClick={handleInteraction}>
                    <CarouselPrevious />
                </div>
                <div onClick={handleInteraction}>
                    <CarouselNext />
                </div>
            </Carousel>
        </div >
    )
}
