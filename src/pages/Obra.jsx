import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';
import AudioPlayer from '../components/AudioPlayer';
import SynchronizedText from '../components/SynchronizedText';

const Obra = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [currentTime, setCurrentTime] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [obra, setObra] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchObra = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('Buscando obra com ID:', id);
                const docRef = doc(db, 'obras', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() };
                    console.log('Obra encontrada:', data);
                    setObra(data);
                } else {
                    console.error('Obra não encontrada no Firestore');
                    setError('Obra não encontrada');
                }
            } catch (err) {
                console.error('Erro ao buscar obra:', err);
                setError('Erro ao carregar obra. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchObra();
    }, [id]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: obra.titulo,
                    text: `Confira esta obra: ${obra.titulo}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Erro ao compartilhar:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado para a área de transferência!');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!id) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <p className="text-gray-500">Nenhuma obra selecionada.</p>
                </div>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded mb-4"></div>
                        <div className="h-12 bg-gray-200 rounded mb-4"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Carregando obra...</p>
                </div>
            </Layout>
        );
    }

    if (error || !obra) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block">
                        <p className="font-semibold">{error || 'Obra não encontrada'}</p>
                        <p className="text-sm mt-2">Verifique se o QR Code está correto.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <article className="flex flex-col items-center max-w-4xl mx-auto w-full">
                {/* Header da Obra */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-green mb-2">
                        {obra.titulo}
                    </h2>
                    {obra.localizacao && (
                        <p className="text-gray-600 font-medium flex items-center justify-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {obra.localizacao}
                        </p>
                    )}
                </div>

                {/* Imagem */}
                <div className="w-full mb-8 relative group">
                    <div className="absolute inset-0 bg-brand-green opacity-0 group-hover:opacity-5 transition-opacity rounded-lg"></div>

                    {/* Loading placeholder */}
                    {imageLoading && !imageError && (
                        <div className="w-full h-[400px] bg-gray-200 rounded-lg shadow-md flex items-center justify-center animate-pulse">
                            <div className="text-gray-400 text-center">
                                <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm">Carregando imagem...</p>
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {imageError && (
                        <div className="w-full h-[400px] bg-gray-100 rounded-lg shadow-md flex items-center justify-center border-2 border-gray-300">
                            <div className="text-gray-500 text-center p-8">
                                <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="font-semibold">Erro ao carregar imagem</p>
                                <p className="text-sm mt-1">A imagem não pôde ser carregada</p>
                            </div>
                        </div>
                    )}

                    {/* Actual image */}
                    <img
                        src={obra.imagemUrl}
                        alt={obra.titulo}
                        className={`w-full h-auto rounded-lg shadow-md object-cover max-h-[500px] ${imageLoading || imageError ? 'hidden' : 'block'}`}
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                            setImageError(true);
                            setImageLoading(false);
                        }}
                    />
                </div>

                {/* Player e Transcrição (Condicional) */}
                {obra.audioUrl ? (
                    <>
                        <div className="w-full mb-8 print:hidden">
                            <AudioPlayer
                                src={obra.audioUrl}
                                onTimeUpdate={setCurrentTime}
                            />
                        </div>

                        <div className="w-full bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8">
                            <SynchronizedText
                                text={obra.transcricao || obra.descricao || ''}
                                currentTime={currentTime}
                                timestamps={obra.timestamps || []}
                            />
                        </div>
                    </>
                ) : (
                    <div className="w-full bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                            {obra.transcricao || obra.descricao || 'Sem descrição disponível.'}
                        </p>
                    </div>
                )}

                {/* Botões de Ação (Share/Print) */}
                <div className="flex gap-4 mb-12 print:hidden">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-full font-bold shadow hover:bg-opacity-90 transition-transform hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Compartilhar
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full font-bold shadow hover:bg-gray-700 transition-transform hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Salvar PDF
                    </button>
                </div>
            </article>

            <style>{`
                @media print {
                    /* Hide layout elements like navbar/footer if they are not hidden by Layout component logic (which we can't see here but assuming Layout handles basic structure) */
                    /* We can target specific classes if needed, but 'print:hidden' utility class is best */
                    
                    body {
                        background: white;
                    }

                    /* Ensure article takes full width */
                    article {
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    /* Hide buttons and player */
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default Obra;
