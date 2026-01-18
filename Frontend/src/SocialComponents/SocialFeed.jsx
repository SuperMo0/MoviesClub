import React, { useEffect } from 'react'
import NewPostEditor from '@/SocialComponents/NewPostEditor'
import { REVIEWS } from '@/socialData' // Make sure this path is correct
import Post from './Post'
import { useMoviesStore } from '@/stores/movies.store';
import { useSocialStore } from '@/stores/social.store';
import { useAuthStore } from '@/stores/auth.store';

export default function SocialFeed() {

    const { getPosts, getUsers, users, userPosts, isLoading, allPosts, likedPosts, getLikedPosts } = useSocialStore();

    const { allMovies, getAllMovies } = useMoviesStore();

    const { authUser } = useAuthStore();


    useEffect(() => {
        if (!users) getUsers();

        if (!userPosts) getPosts();

        if (!allMovies) getAllMovies();

        if (!likedPosts) getLikedPosts();

    }, [])


    if (isLoading || !users || !allPosts || !allMovies || !likedPosts) return <div className="text-white p-10 text-center">Loading profile...</div>;

    return (
        <div className='flex flex-col gap-6 max-w-2xl mx-auto lg:mx-0'>
            {/* The "Create Post" Box */}
            <NewPostEditor />

            {/* Render Posts */}
            <div className='flex flex-col gap-6'>
                {allPosts.map((post) => {
                    const isOwner = authUser?.id === post.authorId;
                    const user = isOwner ? authUser : users.get(post.authorId);
                    return <Post key={post.id} post={post} user={user} />
                })}
            </div>
        </div>
    )
}