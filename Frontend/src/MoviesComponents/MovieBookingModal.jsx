import React, { useState } from 'react';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { CalendarDays, MapPin, X, Clock } from 'lucide-react';

export default function MovieBookingModal({ isModalOpen, movie, closeModal }) {
    if (!isModalOpen || !movie) return null;

    const [cinema, setSelectedCinema] = useState('');
    const [date, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState(null);

    const timeSlots = ["10:30 AM", "01:15 PM", "04:45 PM", "08:00 PM", "11:30 PM"];

    return (
        // 1. BACKDROP: Fixed, covering the whole screen, dimming the background
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">

            {/* The Blur Overlay (Clicking this closes the modal) */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
            ></div>

            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">

                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-red-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>


                <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
                    <img
                        src={movie.image}
                        className="w-full h-full object-cover"
                        alt={movie.title}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* RIGHT: Booking Content */}
                <div className="flex-1 p-6 md:p-8 flex flex-col gap-6">

                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                                Now Showing
                            </span>
                            <span className="text-slate-400 text-xs">{movie.genre || "Action • 2h 15m"}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none mb-2">
                            {movie.title}
                        </h1>
                        <p className="text-slate-400 text-sm line-clamp-2">
                            {movie.description || "Experience the thrill on the big screen. Book your tickets now for an unforgettable cinematic journey."}
                        </p>
                    </div>

                    {/* Inputs Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Cinema Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 uppercase">Cinema</label>
                            <Select onValueChange={setSelectedCinema}>
                                <SelectTrigger className="w-full bg-slate-900/50 border-slate-700 text-slate-200 focus:ring-red-500/50 h-12">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        <SelectValue placeholder="Select Cinema" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    <SelectItem value="c1">Grand Cinema</SelectItem>
                                    <SelectItem value="c2">IMAX Downtown</SelectItem>
                                    <SelectItem value="c3">Galaxy Mall</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 uppercase">Date</label>
                            <Select onValueChange={setSelectedDate}>
                                <SelectTrigger className="w-full bg-slate-900/50 border-slate-700 text-slate-200 focus:ring-red-500/50 h-12">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-red-500" />
                                        <SelectValue placeholder="Pick a Date" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    <SelectItem value="d1">Today, Oct 24</SelectItem>
                                    <SelectItem value="d2">Tomorrow, Oct 25</SelectItem>
                                    <SelectItem value="d3">Sat, Oct 26</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Available Times
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {timeSlots.map((time, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedTime(time)}
                                    className={`
                                        px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200
                                        ${selectedTime === time
                                            ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20'
                                            : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400'
                                        }
                                    `}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-auto pt-4 flex justify-end border-t border-slate-800/50">
                        <button className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-200 px-8 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Confirm Booking
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}