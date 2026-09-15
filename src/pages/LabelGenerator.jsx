import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import logo from '../assets/logo-nova-acropole.png';

const LabelGenerator = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const singleId = searchParams.get('id');
    const idsParam = searchParams.get('ids');
    const titleParam = searchParams.get('title');

    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);

    const printRef = useRef();

    useEffect(() => {
        const fetchLabels = async () => {
            setLoading(true);
            const idsToFetch = idsParam ? idsParam.split(',') : (singleId ? [singleId] : []);

            if (idsToFetch.length === 0) {
                setLoading(false);
                return;
            }

            // If single ID and title is provided in URL, use it directly to save a read
            if (singleId && titleParam) {
                setLabels([{ id: singleId, title: titleParam }]);
                setLoading(false);
                return;
            }

            try {
                const fetchedLabels = await Promise.all(
                    idsToFetch.map(async (id) => {
                        try {
                            const docRef = doc(db, 'obras', id);
                            const docSnap = await getDoc(docRef);
                            if (docSnap.exists()) {
                                return { id, title: docSnap.data().titulo };
                            }
                            return { id, title: 'Obra não encontrada' };
                        } catch (e) {
                            console.error(`Erro ao buscar obra ${id}`, e);
                            return { id, title: 'Erro ao carregar' };
                        }
                    })
                );
                setLabels(fetchedLabels);
            } catch (error) {
                console.error("Erro ao buscar etiquetas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLabels();
    }, [singleId, idsParam, titleParam]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Carregando etiquetas...</p>
            </div>
        );
    }

    if (labels.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow">
                    <p className="text-gray-700 mb-4">Nenhuma etiqueta selecionada.</p>
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
                    Imprimir {labels.length > 1 ? 'Etiquetas' : 'Etiqueta'}
                </button>
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-white text-gray-700 font-bold py-2 px-6 rounded shadow hover:bg-gray-50 transition-colors"
                >
                    Voltar
                </button>
            </div>

            {/* Label Preview / Print Area */}
            <div ref={printRef} className="print-area grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4 print:w-full">
                {labels.map((label, index) => (
                    <div
                        key={label.id}
                        className="label-container bg-white border-2 border-gray-200 flex flex-col items-center justify-center p-6 text-center shadow-lg mx-auto"
                        style={{ width: '340px', height: '350px' }}
                    >
                        <div className="mb-4">
                            <img
                                src={logo}
                                alt="Nova Acrópole"
                                className="h-10 mx-auto mb-2"
                            />
                            <h1 className="text-xl font-serif font-bold text-brand-green">PERIPATOS</h1>
                        </div>

                        <div className="mb-4 p-2 bg-white rounded">
                            <QRCode value={`${window.location.origin}/obra?id=${label.id}`} size={120} fgColor="#00453d" />
                        </div>

                        <div>
                            <h2 className="text-lg font-serif font-bold text-gray-800 leading-tight mb-1 line-clamp-2 px-2">
                                {label.title}
                            </h2>
                            <p className="text-[10px] text-gray-500">Escaneie para ouvir a explicação</p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    
                    .print-area, .print-area * {
                        visibility: visible;
                    }

                    .print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        display: grid !important;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10mm;
                        padding: 10mm;
                    }
                    
                    .label-container {
                        border: 1px solid #ddd !important;
                        box-shadow: none !important;
                        margin: 0 auto;
                        page-break-inside: avoid;
                    }
                    
                    /* Page configuration */
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default LabelGenerator;
