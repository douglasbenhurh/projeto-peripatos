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
            <article className="flex flex-col items-center">
                {/* Header da Obra */}
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-green mb-6 text-center">
                    {obra.titulo}
                </h2>

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
                        className={`w-full h-auto rounded-lg shadow-md object-cover max-h-[400px] ${imageLoading || imageError ? 'hidden' : 'block'}`}
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                            setImageError(true);
                            setImageLoading(false);
                        }}
                    />
                </div>

                {/* Player */}
                <div className="w-full mb-8">
                    <AudioPlayer
                        src={obra.audioUrl}
                        onTimeUpdate={setCurrentTime}
                    />
                </div>

                {/* Texto / Transcrição */}
                <div className="w-full bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <SynchronizedText
                        text={obra.transcricao || obra.descricao || ''}
                        currentTime={currentTime}
                        timestamps={obra.timestamps || []}
                    />
                </div>
            </article>
        </Layout>
    );
};

export default Obra;
