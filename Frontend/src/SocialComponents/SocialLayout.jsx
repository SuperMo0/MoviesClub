import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useSocialStore } from '@/stores/social.store';
import { useAuthStore } from '@/stores/auth.store';
import { useMoviesStore } from '@/stores/movies.store';

export default function SocialLayout() {
    const { getPosts, getUsers, users, allPosts, likedPosts, getLikedPosts } = useSocialStore();
    const { authUser } = useAuthStore();
    const { allMovies, getAllMovies } = useMoviesStore();

    useEffect(() => {
        if (!users) getUsers();
        if (!allPosts) getPosts();
        if (!allMovies) getAllMovies();
        if (authUser && !likedPosts) getLikedPosts();
    }, [authUser, users, allPosts, allMovies, likedPosts]);

    const isLoading = !users || !allPosts || !allMovies || (authUser && !likedPosts);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
                <div className="animate-pulse text-lg font-medium">Loading Social Area...</div>
            </div>
        );
    }

    return <Outlet />;
}
