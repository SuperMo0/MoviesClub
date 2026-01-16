import React from 'react'
import Footer from '@/mycomponents/Footer'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import Header from '@/mycomponents/Header'
import Hero from '@/mycomponents/Hero'
import Qsearch from '@/mycomponents/Qsearch'
import ShowingNow from '@/mycomponents/ShowingNow'

export default function Home() {
    return (
        <>
            <Header />
            <Hero />
            <Qsearch />
            <ShowingNow />
            <Footer />
        </>

    )
}
