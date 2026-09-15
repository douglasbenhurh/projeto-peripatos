import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan, onError }) => {
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        // Create a new scanner instance
        // "reader" is the ID of the HTML element where the scanner will render
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText, decodedResult) => {
                // Handle successful scan
                setScanResult(decodedText);
                if (onScan) {
                    onScan(decodedText, decodedResult);
                }
                // Optional: Clear scanner after success if desired
                // scanner.clear(); 
            },
            (errorMessage) => {
                // Handle scan error (runs frequently when no QR code is in view)
                if (onError) {
                    onError(errorMessage);
                }
            }
        );

        // Cleanup function
        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, [onScan, onError]);

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div id="reader" className="w-full rounded-lg overflow-hidden shadow-lg bg-gray-100"></div>
            {scanResult && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                    <p className="font-bold">Scanned Result:</p>
                    <p className="break-all">{scanResult}</p>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
