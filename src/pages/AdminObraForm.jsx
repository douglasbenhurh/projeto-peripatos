import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { uploadToCloudinary } from '../cloudinary';
import { suggestDescription, suggestLocation, generateImageSearchQuery } from '../services/gemini_service';
import { searchImage, trackDownload, urlToFile } from '../services/unsplash_service';
import Layout from '../components/Layout';
import AiSuggestionModal from '../components/AiSuggestionModal';
import ImageSearchModal from '../components/ImageSearchModal';

const AdminObraForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        localizacao: '',
        texto: '',
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [currentAudioUrl, setCurrentAudioUrl] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // AI Suggestion states
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showImageSearchModal, setShowImageSearchModal] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [imageSearchData, setImageSearchData] = useState(null);
    const [imageSearchPage, setImageSearchPage] = useState(1);

    useEffect(() => {
        const fetchObra = async () => {
            if (isEditing) {
                try {
                    setLoading(true);
                    const docRef = doc(db, 'obras', id);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setFormData({
                            titulo: data.titulo || '',
                            descricao: data.descricao || '',
                            localizacao: data.localizacao || '',
                            texto: data.transcricao || '',
                        });
                        // Carregar URLs de mídia existentes
                        setCurrentImageUrl(data.imagemUrl || '');
                        setCurrentAudioUrl(data.audioUrl || '');
                    } else {
                        setError('Obra não encontrada');
                    }
                } catch (err) {
                    console.error('Erro ao buscar obra:', err);
                    setError('Erro ao carregar dados da obra');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchObra();
    }, [isEditing, id]);

    // Handler para sugestão de descrição
    const handleSuggestDescription = async () => {
        if (!formData.titulo || formData.titulo.trim().length === 0) {
            setError('Por favor, preencha o título primeiro');
            return;
        }

        setShowDescriptionModal(true);
        setAiLoading(true);
        setAiError(null);
        setAiSuggestion('');

        try {
            const suggestion = await suggestDescription(formData.titulo);
            setAiSuggestion(suggestion);
        } catch (err) {
            setAiError(err.message);
        } finally {
            setAiLoading(false);
        }
    };

    // Handler para sugestão de localização
    const handleSuggestLocation = async () => {
        if (!formData.titulo || formData.titulo.trim().length === 0) {
            setError('Por favor, preencha o título primeiro');
            return;
        }

        setShowLocationModal(true);
        setAiLoading(true);
        setAiError(null);
        setAiSuggestion('');

        try {
            const suggestion = await suggestLocation(formData.titulo);
            setAiSuggestion(suggestion);
        } catch (err) {
            setAiError(err.message);
        } finally {
            setAiLoading(false);
        }
    };

    // Handler para busca de imagem
    const handleSearchImage = async (page = 1) => {
        if (!formData.titulo || formData.titulo.trim().length === 0) {
            setError('Por favor, preencha o título primeiro');
            return;
        }

        setShowImageSearchModal(true);
        setAiLoading(true);
        setAiError(null);
        setImageSearchPage(page);

        if (page === 1) {
            setImageSearchData(null);
        }

        try {
            // 1. Gera query otimizada com IA
            let query = formData.titulo;

            try {
                const optimizedQuery = await generateImageSearchQuery(formData.titulo);
                console.log(`🔍 Query original: "${formData.titulo}" | Otimizada: "${optimizedQuery}"`);
                query = optimizedQuery;
            } catch {
                console.warn('Falha ao otimizar query, usando título original');
            }

            // 2. Busca no Unsplash com a query otimizada
            const result = await searchImage(query, page);
            setImageSearchData(result);
        } catch (err) {
            setAiError(err.message);
        } finally {
            setAiLoading(false);
        }
    };

    const handleNextImage = () => {
        handleSearchImage(imageSearchPage + 1);
    };

    // Confirmar sugestão de descrição
    const handleConfirmDescription = (suggestion) => {
        setFormData(prev => ({ ...prev, descricao: suggestion }));
        setShowDescriptionModal(false);
        setAiSuggestion('');
    };

    // Confirmar sugestão de localização
    const handleConfirmLocation = (suggestion) => {
        setFormData(prev => ({ ...prev, localizacao: suggestion }));
        setShowLocationModal(false);
        setAiSuggestion('');
    };

    // Confirmar seleção de imagem
    const handleConfirmImage = async (imageData) => {
        try {
            setAiLoading(true);

            // Registrar download (requisito do Unsplash)
            if (imageData.downloadLink) {
                await trackDownload(imageData.downloadLink);
            }

            // Converter URL em File object
            const imageFile = await urlToFile(imageData.downloadUrl, `unsplash-${imageData.id}.jpg`);
            setSelectedImage(imageFile);

            setShowImageSearchModal(false);
            setImageSearchData(null);
            setImageSearchPage(1);
        } catch (err) {
            setAiError('Erro ao processar imagem: ' + err.message);
        } finally {
            setAiLoading(false);
        }
    };

    // Cancelar modais de IA
    const handleCancelAiModal = () => {
        setShowDescriptionModal(false);
        setShowLocationModal(false);
        setShowImageSearchModal(false);
        setAiSuggestion('');
        setAiError(null);
        setImageSearchData(null);
        setImageSearchPage(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedAudio(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!auth.currentUser) {
            setError('Você precisa estar autenticado para realizar esta ação. Por favor, faça login novamente.');
            setLoading(false);
            return;
        }

        try {
            let imagemUrl = '';
            let audioUrl = '';

            // Upload de imagem para o Cloudinary
            if (selectedImage) {
                imagemUrl = await uploadToCloudinary(selectedImage, 'image');
            }

            // Upload de áudio para o Cloudinary
            if (selectedAudio) {
                audioUrl = await uploadToCloudinary(selectedAudio, 'video');
            }

            // Preparar dados para salvar
            const obraData = {
                titulo: formData.titulo,
                descricao: formData.descricao,
                localizacao: formData.localizacao,
                transcricao: formData.texto,
                imagemUrl: imagemUrl || currentImageUrl,
                audioUrl: audioUrl || currentAudioUrl,
                updatedAt: new Date(),
            };

            if (isEditing) {
                const docRef = doc(db, 'obras', id);
                await updateDoc(docRef, obraData);
            } else {
                obraData.createdAt = new Date();
                await addDoc(collection(db, 'obras'), obraData);
            }

            navigate('/admin');
        } catch (err) {
            console.error('❌ Erro ao salvar obra:', err);
            setError(`Erro ao salvar obra: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        navigate('/admin');
    };

    const dismissCancelModal = () => {
        setShowCancelModal(false);
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-brand-green">
                    {isEditing ? 'Editar Obra' : 'Nova Obra'}
                </h2>
            </div>

            {error && (
                <div className="bg-red-50 border border-brand-red text-brand-red px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título */}
                <div>
                    <label className="block text-brand-green text-sm font-bold mb-2" htmlFor="titulo">
                        Título da Obra
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-brand-green"
                        id="titulo"
                        name="titulo"
                        type="text"
                        value={formData.titulo}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Localização */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-brand-green text-sm font-bold" htmlFor="localizacao">
                            Localização
                        </label>
                        <button
                            type="button"
                            onClick={handleSuggestLocation}
                            disabled={!formData.titulo || formData.titulo.trim().length === 0}
                            className="text-xs bg-brand-yellow hover:bg-opacity-80 text-brand-green font-semibold py-1 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            <span>✨</span>
                            Sugerir com IA
                        </button>
                    </div>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-brand-green"
                        id="localizacao"
                        name="localizacao"
                        type="text"
                        value={formData.localizacao}
                        onChange={handleChange}
                        placeholder="Ex: Jardim Central, Hall Principal"
                    />
                </div>

                {/* Descrição Curta */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-brand-green text-sm font-bold" htmlFor="descricao">
                            Descrição Curta
                        </label>
                        <button
                            type="button"
                            onClick={handleSuggestDescription}
                            disabled={!formData.titulo || formData.titulo.trim().length === 0}
                            className="text-xs bg-brand-yellow hover:bg-opacity-80 text-brand-green font-semibold py-1 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            <span>✨</span>
                            Sugerir com IA
                        </button>
                    </div>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-brand-green"
                        id="descricao"
                        name="descricao"
                        rows="3"
                        value={formData.descricao}
                        onChange={handleChange}
                    />
                </div>

                {/* Imagem */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-brand-green text-sm font-bold">
                            Imagem da Obra
                        </label>
                        <button
                            type="button"
                            onClick={() => handleSearchImage(1)}
                            disabled={!formData.titulo || formData.titulo.trim().length === 0}
                            className="text-xs bg-brand-yellow hover:bg-opacity-80 text-brand-green font-semibold py-1 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            <span>🔍</span>
                            Buscar Imagem
                        </button>
                    </div>

                    {currentImageUrl && !selectedImage && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Imagem Atual:</p>
                            <img src={currentImageUrl} alt="Atual" className="h-32 mx-auto object-cover rounded" />
                        </div>
                    )}

                    {selectedImage && (
                        <div className="mb-4">
                            <p className="text-sm text-brand-green font-semibold mb-2">Nova imagem selecionada:</p>
                            <div className="relative inline-block">
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="Preview"
                                    className="h-32 mx-auto object-cover rounded border-2 border-brand-green"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    title="Remover imagem"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{selectedImage.name}</p>
                        </div>
                    )}

                    <input
                        type="file"
                        id="imagem"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="imagem"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded inline-block transition-colors"
                    >
                        Escolher Arquivo
                    </label>
                </div>

                {/* Áudio */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <label className="block text-brand-green text-sm font-bold mb-4">
                        Áudio Explicativo
                    </label>

                    {currentAudioUrl && !selectedAudio && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Áudio Atual:</p>
                            <audio controls src={currentAudioUrl} className="mx-auto" />
                        </div>
                    )}

                    {selectedAudio && (
                        <div className="mb-4">
                            <p className="text-sm text-brand-green font-semibold">Novo áudio selecionado:</p>
                            <p className="text-xs text-gray-500">{selectedAudio.name}</p>
                        </div>
                    )}

                    <input
                        type="file"
                        id="audio"
                        accept="audio/*"
                        onChange={handleAudioChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="audio"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded inline-block transition-colors"
                    >
                        Escolher Arquivo
                    </label>
                </div>

                {/* Texto/Transcrição */}
                <div>
                    <label className="block text-brand-green text-sm font-bold mb-2" htmlFor="texto">
                        Texto / Transcrição
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-brand-green"
                        id="texto"
                        name="texto"
                        rows="10"
                        value={formData.texto}
                        onChange={handleChange}
                    />
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={handleCancelClick}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {loading ? 'Salvando...' : 'Salvar Obra'}
                    </button>
                </div>
            </form>

            {/* Modais */}
            <AiSuggestionModal
                isOpen={showDescriptionModal}
                title="Sugestão de Descrição"
                suggestion={aiSuggestion}
                loading={aiLoading}
                error={aiError}
                onConfirm={handleConfirmDescription}
                onCancel={handleCancelAiModal}
            />

            <AiSuggestionModal
                isOpen={showLocationModal}
                title="Sugestão de Localização"
                suggestion={aiSuggestion}
                loading={aiLoading}
                error={aiError}
                onConfirm={handleConfirmLocation}
                onCancel={handleCancelAiModal}
            />

            <ImageSearchModal
                isOpen={showImageSearchModal}
                imageData={imageSearchData}
                loading={aiLoading}
                error={aiError}
                onSelectImage={handleConfirmImage}
                onNext={handleNextImage}
                onCancel={handleCancelAiModal}
            />

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Descartar alterações?</h3>
                        <p className="text-gray-600 mb-6">
                            Se você sair agora, todas as alterações não salvas serão perdidas.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={dismissCancelModal}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Continuar Editando
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                            >
                                Descartar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminObraForm;
