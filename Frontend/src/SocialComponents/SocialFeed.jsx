import React, { useEffect } from 'react'
import NewPostEditor from '@/SocialComponents/NewPostEditor'
import { REVIEWS } from '@/socialData' // Make sure this path is correct
import Post from './Post'
import { useMoviesStore } from '@/stores/movies.store';
import { useSocialStore } from '@/stores/social.store';

export default function SocialFeed() {

    const { getPosts, getUsers, users, userPosts, isLoading, allPosts } = useSocialStore();

    const { allMovies, getAllMovies } = useMoviesStore();

    useEffect(() => {
        if (!users) getUsers();

        if (!userPosts) getPosts();

        if (!allMovies) getAllMovies();

    }, [])

    if (isLoading || !users || !allPosts || !allMovies) return <div className="text-white p-10 text-center">Loading profile...</div>;

    return (
        <div className='flex flex-col gap-6 max-w-2xl mx-auto lg:mx-0'>
            {/* The "Create Post" Box */}
            <NewPostEditor />

            {/* Render Posts */}
            <div className='flex flex-col gap-6'>
                {allPosts.map((post) => (
                    <Post key={post.id} post={post} user={users.get(post.authorId)} />
                ))}
            </div>
        </div>
    )
}