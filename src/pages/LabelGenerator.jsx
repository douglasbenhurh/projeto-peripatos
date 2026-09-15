import React, { useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import logo from '../assets/logo-nova-acropole.png';

const LabelGenerator = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('id');
    const title = searchParams.get('title') || 'Título da Obra';

    // URL to be encoded in the QR
    const url = `${window.location.origin}/obra?id=${id}`;

    const printRef = useRef();

    const handlePrint = () => {
        window.print();
    };

    if (!id) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow">
                    <p className="text-gray-700 mb-4">ID da obra não fornecido.</p>
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-brand-green text-white font-bold py-2 px-6 rounded hover:bg-opacity-90"
                    >
                        Voltar ao Admin
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
            {/* Controls - Hidden when printing */}
            <div className="mb-8 print:hidden flex gap-4">
                <button
                    onClick={handlePrint}
                    className="bg-brand-green text-white font-bold py-2 px-6 rounded shadow hover:bg-opacity-90 transition-colors"
                >
                    Imprimir Etiqueta
                </button>
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-white text-gray-700 font-bold py-2 px-6 rounded shadow hover:bg-gray-50 transition-colors"
                >
                    Voltar
                </button>
            </div>

            {/* Label Preview / Print Area */}
            <div
                ref={printRef}
                className="label-container bg-white w-[300px] h-[400px] border-2 border-gray-200 flex flex-col items-center justify-center p-8 text-center shadow-lg"
            >
                <div className="mb-6">
                    <img
                        src={logo}
                        alt="Nova Acrópole"
                        className="h-12 mx-auto mb-3"
                    />
                    <h1 className="text-2xl font-serif font-bold text-brand-green">PERIPATOS</h1>
                </div>

                <div className="mb-6 p-2 bg-white rounded">
                    <QRCode value={url} size={150} fgColor="#00453d" />
                </div>

                <div>
                    <h2 className="text-xl font-serif font-bold text-gray-800 leading-tight mb-2">
                        {title}
                    </h2>
                    <p className="text-xs text-gray-500">Escaneie para ouvir a explicação</p>
                </div>
            </div>

            <style>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    /* Make the parent container visible */
                    body > div {
                        display: block !important;
                        background: white !important;
                    }
                    
                    /* Show only the label container */
                    .label-container {
                        display: flex !important;
                        position: absolute;
                        top: 0;
                        left: 0;
                        margin: 0 !important;
                        padding: 2rem !important;
                        border: none !important;
                        box-shadow: none !important;
                        width: 300px;
                        height: 400px;
                        background: white;
                    }
                    
                    /* Page configuration */
                    @page {
                        size: 300px 400px;
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default LabelGenerator;
