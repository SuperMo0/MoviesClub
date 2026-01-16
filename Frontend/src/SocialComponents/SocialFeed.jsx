import React from 'react'
import NewPostEditor from '@/SocialComponents/NewPostEditor'
import { REVIEWS } from '@/socialData' // Make sure this path is correct
import Post from './Post'

export default function SocialFeed() {
    return (
        <div className='flex flex-col gap-6 max-w-2xl mx-auto lg:mx-0'>
            {/* The "Create Post" Box */}
            <NewPostEditor />

            {/* Render Posts */}
            <div className='flex flex-col gap-6'>
                {REVIEWS.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}