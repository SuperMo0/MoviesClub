import React, { useState, useEffect, useRef } from 'react'
import { Image, Film, Send, Smile, Star, X } from 'lucide-react'

export default function NewPostEditor() {
    const [content, setContent] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [rating, setRating] = useState(0); // 0 to 5
    const [hoverRating, setHoverRating] = useState(0); // For hover effect
    const [showMoviePicker, setShowMoviePicker] = useState(false); // Fix: Control visibility with state

    // Close dropdown if clicking outside
    const pickerRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowMoviePicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const recentMovies = ["Dune: Part Two", "Inception", "The Batman", "Oppenheimer", "Poor Things"];

    return (
        <div className='bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg'>
            <div className='flex gap-4'>
                <img
                    src="https://i.pravatar.cc/150?u=my_user"
                    className='w-10 h-10 rounded-full bg-slate-800 object-cover'
                    alt="My Avatar"
                />

                <div className='flex-1 flex flex-col gap-3'>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What did you watch today?"
                        className='w-full bg-transparent text-white placeholder:text-slate-500 resize-none outline-none text-base min-h-[80px]'
                    />

                    {/* Selected Movie Pill & Rating */}
                    {selectedMovie && (
                        <div className="flex flex-wrap items-center gap-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                            {/* Movie Name */}
                            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                                <Film className="w-4 h-4" />
                                {selectedMovie}
                            </div>

                            {/* Separator */}
                            <div className="h-4 w-px bg-slate-700"></div>

                            {/* Interactive Star Rating */}
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-5 h-5 transition-colors ${star <= (hoverRating || rating)
                                                    ? 'fill-yellow-500 text-yellow-500'
                                                    : 'text-slate-600'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => { setSelectedMovie(null); setRating(0); }}
                                className="ml-auto text-slate-500 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className='h-px w-full bg-slate-800 my-1'></div>

                    {/* Toolbar */}
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2 relative'>
                            <button className='p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors'>
                                <Image className='w-5 h-5' />
                            </button>

                            {/* MOVIE SELECTOR (Fixed) */}
                            <div ref={pickerRef} className="relative">
                                <button
                                    onClick={() => setShowMoviePicker(!showMoviePicker)}
                                    className={`p-2 rounded-full transition-colors flex items-center gap-2 ${showMoviePicker ? 'bg-red-500/20 text-red-500' : 'hover:bg-slate-800 text-slate-400 hover:text-red-500'
                                        }`}
                                >
                                    <Film className='w-5 h-5' />
                                </button>

                                {/* Dropdown Menu (Now controlled by click state) */}
                                {showMoviePicker && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                                            Recent Releases
                                        </div>
                                        {recentMovies.map(movie => (
                                            <button
                                                key={movie}
                                                onClick={() => {
                                                    setSelectedMovie(movie);
                                                    setShowMoviePicker(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <Film className="w-3 h-3 opacity-50" />
                                                {movie}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className='p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors'>
                                <Smile className='w-5 h-5' />
                            </button>
                        </div>

                        <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 transition-colors'>
                            Post <Send className='w-4 h-4' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}