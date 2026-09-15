import React, { useState, useRef } from 'react';

const AudioPlayer = ({ src, onTimeUpdate }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            setCurrentTime(current);
            if (onTimeUpdate) {
                onTimeUpdate(current);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="w-full bg-brand-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="flex flex-col gap-2">
                {/* Progress Bar */}
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                    style={{
                        background: `linear-gradient(to right, #faaa31 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%)`
                    }}
                />

                <div className="flex justify-between text-xs text-gray-500 font-medium font-sans">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex justify-center mt-2">
                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-green text-brand-yellow hover:bg-opacity-90 transition-all shadow-md"
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
