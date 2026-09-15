import React, { useState } from 'react';
import QRScanner from '../components/QRScanner';
import { Link } from 'react-router-dom';

const ScanPage = () => {
    const [lastResult, setLastResult] = useState(null);

    const handleScan = (decodedText) => {
        console.log("Scanned:", decodedText);
        setLastResult(decodedText);
    };

    const handleError = (error) => {
        console.warn(error); // Uncomment to see scanning errors
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Scan QR Code
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Point your camera at a QR code to read it.
                    </p>
                </div>

                <div className="mt-8">
                    <QRScanner onScan={handleScan} onError={handleError} />
                </div>

                {lastResult && (
                    <div className="mt-8 p-4 bg-white shadow rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900">Last Scanned Code:</h3>
                        <p className="mt-2 text-gray-600 break-all bg-gray-50 p-3 rounded border border-gray-200">
                            {lastResult}
                        </p>
                    </div>
                )}

                <div className="mt-4 text-center">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-500 font-medium">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ScanPage;
