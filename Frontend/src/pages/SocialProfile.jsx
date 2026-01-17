import React, { useEffect } from 'react'
import Post from '@/SocialComponents/Post';
import NewPostEditor from '@/SocialComponents/NewPostEditor';
import { REVIEWS } from '@/socialData'
import { MapPin, Calendar, Edit3, Link as LinkIcon, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store';
import { useLocation, useParams } from 'react-router';
import { useSocialStore } from '@/stores/social.store';
import { useMoviesStore } from '@/stores/movies.store';

export default function SocialProfile() {

    const { authUser } = useAuthStore()

    const { id } = useLocation().state  // there might be no Id if user came directly to the this Link

    const { username } = useParams();

    const { getPosts, getUsers, users, userPosts, isLoading } = useSocialStore();

    const { allMovies, getAllMovies } = useMoviesStore();

    useEffect(() => {
        if (!users) getUsers();

        if (!userPosts) getPosts();

        if (!allMovies) getAllMovies();

    }, [])


    if (isLoading || !users || !userPosts || !allMovies) return <div className="text-white p-10 text-center">Loading profile...</div>;

    const user = users.get(id);
    const posts = userPosts.get(id);

    const stats = [
        { label: 'Reviews', value: posts.length },
        { label: 'Followers', value: user._count.followedBy },
        { label: 'Following', value: user._count.following },
    ];

    return (
        <div className='bg-slate-950 min-h-screen pb-12'>

            {/* --- HEADER SECTION --- */}
            <div className='relative mb-20 md:mb-24'>

                <div className='h-48 md:h-64 w-full bg-slate-800 overflow-hidden relative'>
                    <img
                        className='w-full h-full object-cover opacity-80'
                        src={"https://wallpapercave.com/wp/wp10021077.jpg"}
                        alt="Banner"
                    />
                    {/* Gradient Fade at bottom to blend with body */}
                    <div className='absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent'></div>
                </div>

                {/* 2. Profile Info Wrapper (Overlaps Banner) */}
                <div className='absolute top-full left-0 w-full -translate-y-1/2 md:-translate-y-[40%]'>
                    <div className='max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-end gap-6'>

                        {/* Avatar with Cutout Effect */}
                        <div className='relative group'>
                            <div className='w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-slate-950 overflow-hidden bg-slate-800 shadow-xl'>
                                <img
                                    className='w-full h-full object-cover'
                                    src={user.image || "https://i.pravatar.cc/150"}
                                    alt={user.name}
                                />
                            </div>
                            {/* Hover Edit Icon */}
                            <button className='absolute bottom-2 right-2 p-2 bg-slate-900 rounded-full text-slate-400 border border-slate-700 hover:text-white hover:border-white transition-colors'>
                                <Edit3 className='w-4 h-4' />
                            </button>
                        </div>

                        {/* User Details & Actions */}
                        <div className='flex-1 flex flex-col md:flex-row items-end justify-between gap-4 w-full md:w-auto pb-2'>

                            {/* Text Info */}
                            <div className='text-center md:text-left mt-2 md:mt-0 w-full md:w-auto'>
                                <h1 className='text-3xl font-bold text-white leading-tight'>{user.name}</h1>
                                <p className='text-slate-500 font-medium'>@{user.username}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-3 w-full md:w-auto justify-center md:justify-start'>
                                {authUser.username != username &&
                                    <button className='bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-full transition-colors shadow-lg shadow-red-900/20'>
                                        Follow
                                    </button>
                                }
                                {authUser.username == username &&
                                    <button className='bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-full transition-colors'>
                                        Edit Profile
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BIO & STATS SECTION --- */}
            <div className='max-w-4xl mx-auto px-4 md:px-8 mb-8'>
                <div className='flex flex-col md:flex-row gap-8'>

                    {/* Left Column: Bio & Metadata */}
                    <div className='w-full md:w-1/3 flex flex-col gap-6'>

                        {/* Bio */}
                        <div>
                            <p className='text-slate-300 leading-relaxed text-sm md:text-base'>
                                {user.bio}
                            </p>

                            {/* Metadata Icons */}
                            <div className='mt-4 flex flex-col gap-2 text-sm text-slate-500'>
                                <div className='flex items-center gap-2'>
                                    <MapPin className='w-4 h-4' /> Egypt
                                </div>
                                <div className='flex items-center gap-2'>
                                    <LinkIcon className='w-4 h-4' /> <a href="#" className='text-red-400 hover:underline'>letterboxd.com/sarah</a>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Calendar className='w-4 h-4' /> Joined {user.joinedAt.slice(0, 10)}
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards (Mobile/Desktop friendly) */}
                        <div className='flex justify-between md:justify-start md:gap-8 border-y border-slate-800 py-4'>
                            {stats.map((stat) => (
                                <div key={stat.label} className='text-center md:text-left'>
                                    <span className='block text-xl font-bold text-white'>{stat.value}</span>
                                    <span className='text-xs text-slate-500 uppercase tracking-wide'>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- MAIN FEED SECTION --- */}
                    <div className='flex-1'>

                        <div className='mb-8'>
                            <NewPostEditor />
                        </div>

                        {/* Filters / Tabs */}
                        <div className='flex gap-6 border-b border-slate-800 mb-6'>
                            <button className='pb-3 text-red-500 border-b-2 border-red-500 font-medium'>
                                Reviews
                            </button>
                            <button className='pb-3 text-slate-500 hover:text-slate-300 font-medium transition-colors'>
                                Media
                            </button>
                            <button className='pb-3 text-slate-500 hover:text-slate-300 font-medium transition-colors'>
                                Likes
                            </button>
                        </div>

                        <div className='flex flex-col gap-6'>
                            {posts.map((post) => (
                                <Post key={post.id} post={post} user={user} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}