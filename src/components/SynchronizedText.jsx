import React from 'react';

const SynchronizedText = ({ text, currentTime, timestamps }) => {
    // If no timestamps are provided, just show the text
    if (!timestamps || timestamps.length === 0) {
        return (
            <div className="prose prose-stone max-w-none text-brand-green font-medium leading-relaxed text-justify">
                <p>{text}</p>
            </div>
        );
    }

    // Find the active segment
    const activeIndex = timestamps.findIndex((t, i) => {
        const nextTime = timestamps[i + 1] ? timestamps[i + 1].time : Infinity;
        return currentTime >= t.time && currentTime < nextTime;
    });

    return (
        <div className="text-lg leading-relaxed text-justify font-medium font-sans">
            {timestamps.map((segment, index) => (
                <span
                    key={index}
                    className={`transition-colors duration-300 ${index === activeIndex
                            ? 'text-brand-green font-bold' // Active text
                            : index < activeIndex
                                ? 'text-brand-green opacity-80' // Past text
                                : 'text-gray-400' // Future text
                        }`}
                >
                    {segment.text}{' '}
                </span>
            ))}
        </div>
    );
};

export default SynchronizedText;
