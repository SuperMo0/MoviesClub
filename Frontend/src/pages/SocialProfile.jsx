import React, { useEffect, useState, useRef } from 'react'
import Post from '@/SocialComponents/Post';
import NewPostEditor from '@/SocialComponents/NewPostEditor';
import Cropper from '@/SocialComponents/Cropper';
import { MapPin, Calendar, Edit3, Link as LinkIcon, Camera, X, Check, UserPlus, UserMinus } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store';
import { useParams } from 'react-router';
import { useSocialStore } from '@/stores/social.store';
import { useMoviesStore } from '@/stores/movies.store';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function SocialProfile() {

    const { authUser, check } = useAuthStore()
    const { id } = useParams();

    // Store Data
    const { getPosts, getUsers, users, userPosts, isLoading, likedPosts, getLikedPosts } = useSocialStore();
    const { allMovies, getAllMovies } = useMoviesStore();

    // Local State
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // MOCK Follow State
    const [isFollowing, setIsFollowing] = useState(false);

    // --- REFS FOR UNCONTROLLED INPUTS ---
    const nameRef = useRef(null);
    const bioRef = useRef(null);
    const fileInputRef = useRef(null);

    // Image Handling State
    const [previewImage, setPreviewImage] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);
    const [rawImageForCropper, setRawImageForCropper] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    useEffect(() => {
        if (!users) getUsers();
        if (!userPosts) getPosts();
        if (!allMovies) getAllMovies();
        if (!likedPosts) getLikedPosts();
    }, [])

    // --- HANDLERS ---

    function startEditing() {
        // No need to set state for name/bio, defaultValue handles it on mount
        setPreviewImage(authUser.image);
        setImageBlob(null);
        setIsEditing(true);
    }

    function cancelEditing() {
        setIsEditing(false);
        setRawImageForCropper(null);
        setImageBlob(null);
        setPreviewImage(null);
    }

    function onFileSelect(e) {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setRawImageForCropper(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    }

    async function onCropComplete(croppedDataUrl) {
        setShowCropper(false);
        setRawImageForCropper(null);

        if (croppedDataUrl) {
            setPreviewImage(croppedDataUrl);
            try {
                const res = await fetch(croppedDataUrl);
                const blob = await res.blob();
                setImageBlob(blob);
            } catch (error) {
                console.error("Error processing crop:", error);
                toast.error("Failed to process image");
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleSaveChanges() {
        // Access values directly from DOM via Refs
        const nameValue = nameRef.current.value;
        const bioValue = bioRef.current.value;

        if (!nameValue.trim()) return toast.error("Name cannot be empty");

        setIsSaving(true);
        const toastId = toast.loading("Updating profile...");

        try {
            const formData = new FormData();
            formData.append('name', nameValue);
            formData.append('bio', bioValue);

            if (imageBlob) {
                formData.append('image', imageBlob, 'profile.jpg');
            }

            await api.put('/social/profile', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            await check();
            toast.update(toastId, { render: "Profile updated!", type: "success", isLoading: false, autoClose: 2000 });
            setIsEditing(false);

        } catch (error) {
            console.error(error);
            toast.update(toastId, { render: "Update failed", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsSaving(false);
        }
    }

    function handleFollowToggle() {
        setIsFollowing(!isFollowing);
        if (!isFollowing) toast.success(`You are now following this user`);
    }

    if (isLoading || !users || !userPosts || !allMovies || !likedPosts) return <div className="text-white p-10 text-center">Loading profile...</div>;

    const isOwner = authUser?.id === id;
    const user = isOwner ? authUser : users.get(id);
    const posts = userPosts.get(id) || [];

    if (!user) return <div className="text-white p-10 text-center">User not found</div>;

    const stats = [
        { label: 'Reviews', value: posts.length },
        { label: 'Followers', value: user._count?.followedBy || 0 },
        { label: 'Following', value: user._count?.following || 0 },
    ];

    return (
        <>
            {showCropper && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
                    <div className='bg-slate-900 p-6 rounded-xl w-full max-w-lg'>
                        <Cropper image={rawImageForCropper} closeModal={onCropComplete} />
                        <button
                            onClick={() => setShowCropper(false)}
                            className="mt-4 w-full py-2 text-slate-400 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className='bg-slate-950 min-h-screen pb-12'>
                <div className='relative mb-24 md:mb-28'>
                    <div className='h-48 md:h-64 w-full bg-slate-800 overflow-hidden relative'>
                        <img
                            className='w-full h-full object-cover opacity-60'
                            src={"https://wallpapercave.com/wp/wp10021077.jpg"}
                            alt="Banner"
                        />
                        <div className='absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent'></div>
                    </div>

                    <div className='absolute top-full left-0 w-full -translate-y-1/2 md:-translate-y-[40%]'>
                        <div className='max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-end gap-6'>
                            <div className='relative group'>
                                <div className='w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-slate-950 overflow-hidden bg-slate-800 shadow-xl relative'>
                                    <img
                                        className='w-full h-full object-cover'
                                        src={isEditing ? previewImage : (user.image || "https://i.pravatar.cc/150")}
                                        alt={user.name}
                                    />
                                    {isEditing && (
                                        <div
                                            onClick={() => fileInputRef.current.click()}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                                        >
                                            <Camera className="w-8 h-8 text-white opacity-80" />
                                            <input
                                                type="file"
                                                hidden
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={onFileSelect}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='flex-1 flex flex-col md:flex-row items-end justify-between gap-4 w-full md:w-auto pb-2'>
                                <div className='text-center md:text-left mt-2 md:mt-0 w-full md:flex-1'>
                                    {isEditing ? (
                                        <div className="flex flex-col gap-2 w-full md:max-w-md">
                                            {/* UNCONTROLLED INPUT */}
                                            <input
                                                ref={nameRef}
                                                defaultValue={user.name}
                                                className="bg-slate-900 border border-slate-700 text-white text-xl md:text-2xl font-bold px-3 py-1 rounded focus:outline-none focus:border-red-500"
                                                placeholder="Display Name"
                                            />
                                            <input
                                                disabled
                                                value={'@' + user.username}
                                                className="bg-transparent text-slate-500 font-medium px-3 text-sm border-none cursor-not-allowed"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className='text-3xl font-bold text-white leading-tight'>{user.name}</h1>
                                            <p className='text-slate-500 font-medium'>@{user.username}</p>
                                        </>
                                    )}
                                </div>

                                <div className='flex gap-3 w-full md:w-auto justify-center md:justify-start'>
                                    {!isOwner && (
                                        <button
                                            onClick={handleFollowToggle}
                                            className={`
                                                font-semibold px-6 py-2 rounded-full transition-colors shadow-lg flex items-center gap-2
                                                ${isFollowing
                                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                                    : 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/20'}
                                            `}
                                        >
                                            {isFollowing ? (
                                                <><UserMinus className="w-4 h-4" /> Unfollow</>
                                            ) : (
                                                <><UserPlus className="w-4 h-4" /> Follow</>
                                            )}
                                        </button>
                                    )}

                                    {isOwner && !isEditing && (
                                        <button
                                            onClick={startEditing}
                                            className='bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-full transition-colors flex items-center gap-2'
                                        >
                                            <Edit3 className="w-4 h-4" /> Edit Profile
                                        </button>
                                    )}

                                    {isOwner && isEditing && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={cancelEditing}
                                                disabled={isSaving}
                                                className='bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-full transition-colors'
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={handleSaveChanges}
                                                disabled={isSaving}
                                                className='bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20'
                                            >
                                                {isSaving ? "Saving..." : <><Check className="w-4 h-4" /> Save</>}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='max-w-4xl mx-auto px-4 md:px-8 mb-8'>
                    <div className='flex flex-col md:flex-row gap-8'>
                        <div className='w-full md:w-1/3 flex flex-col gap-6'>
                            <div>
                                {isEditing ? (
                                    /* UNCONTROLLED TEXTAREA */
                                    <textarea
                                        ref={bioRef}
                                        defaultValue={user.bio || ""}
                                        className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded p-3 h-32 focus:outline-none focus:border-red-500 resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className='text-slate-300 leading-relaxed text-sm md:text-base'>
                                        {user.bio || "No bio yet."}
                                    </p>
                                )}

                                <div className='mt-4 flex flex-col gap-2 text-sm text-slate-500'>
                                    <div className='flex items-center gap-2'>
                                        <MapPin className='w-4 h-4' /> Egypt
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <LinkIcon className='w-4 h-4' /> <a href="#" className='text-red-400 hover:underline'>letterboxd.com/{user.username}</a>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Calendar className='w-4 h-4' /> {`Joined ${user.joinedAt}`}
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-between md:justify-start md:gap-8 border-y border-slate-800 py-4'>
                                {stats.map((stat) => (
                                    <div key={stat.label} className='text-center md:text-left'>
                                        <span className='block text-xl font-bold text-white'>{stat.value}</span>
                                        <span className='text-xs text-slate-500 uppercase tracking-wide'>{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='flex-1'>
                            {isOwner && (
                                <div className='mb-8'>
                                    <NewPostEditor />
                                </div>
                            )}

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
                                {posts.length > 0 ? posts.map((post) => (
                                    <Post key={post.id} post={post} user={user} />
                                )) : (
                                    <div className="text-slate-500 text-center py-10">No posts yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}