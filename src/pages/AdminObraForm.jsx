import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { uploadToCloudinary } from '../cloudinary';
import Layout from '../components/Layout';

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
                        console.log('📂 URLs de mídia carregadas:', {
                            imagem: data.imagemUrl,
                            audio: data.audioUrl
                        });
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

        console.log('🔵 Iniciando salvamento de obra...');
        console.log('📋 Dados do formulário:', formData);
        console.log('📷 Imagem selecionada:', selectedImage?.name);
        console.log('🎵 Áudio selecionado:', selectedAudio?.name);

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
                console.log('🔵 Iniciando upload de imagem...');
                imagemUrl = await uploadToCloudinary(selectedImage, 'image');
                console.log('✅ Imagem enviada:', imagemUrl);
            }

            // Upload de áudio para o Cloudinary
            if (selectedAudio) {
                console.log('🔵 Iniciando upload de áudio...');
                audioUrl = await uploadToCloudinary(selectedAudio, 'video'); // Cloudinary usa 'video' para áudios
                console.log('✅ Áudio enviado:', audioUrl);
            }

            // Preparar dados para salvar
            const obraData = {
                titulo: formData.titulo,
                descricao: formData.descricao,
                localizacao: formData.localizacao,
                transcricao: formData.texto,
                // Preservar URLs: usar novo upload OU manter existente
                imagemUrl: imagemUrl || currentImageUrl,
                audioUrl: audioUrl || currentAudioUrl,
                updatedAt: new Date(),
            };

            console.log('💾 URLs finais a salvar:', {
                imagem: obraData.imagemUrl,
                audio: obraData.audioUrl
            });

            console.log('🔵 Salvando no Firestore:', obraData);

            if (isEditing) {
                // Atualizar obra existente
                const docRef = doc(db, 'obras', id);
                await updateDoc(docRef, obraData);
                console.log('✅ Obra atualizada com sucesso:', id);
            } else {
                // Criar nova obra
                obraData.createdAt = new Date();
                const docRef = await addDoc(collection(db, 'obras'), obraData);
                console.log('✅ Nova obra criada com sucesso. ID:', docRef.id);
            }

            // Redirecionar para o dashboard
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

            {/* Error Message */}
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
                    <label className="block text-brand-green text-sm font-bold mb-2" htmlFor="localizacao">
                        Localização
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-brand-green"
                        id="localizacao"
                        name="localizacao"
                        type="text"
                        placeholder="Ex: Jardim Central"
                        value={formData.localizacao}
                        onChange={handleChange}
                    />
                </div>

                {/* Descrição Curta */}
                <div>
                    <label className="block text-brand-green text-sm font-bold mb-2" htmlFor="descricao">
                        Descrição Curta
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-brand-green"
                        id="descricao"
                        name="descricao"
                        rows="3"
                        value={formData.descricao}
                        onChange={handleChange}
                    />
                </div>

                {/* Upload de Imagem */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <p className="text-gray-500 mb-2 text-center">Imagem da Obra</p>

                    {/* Preview da imagem existente */}
                    {isEditing && currentImageUrl && !selectedImage && (
                        <div className="mb-4">
                            <div className="relative inline-block">
                                <img
                                    src={currentImageUrl}
                                    alt="Imagem atual"
                                    className="h-32 w-auto rounded-lg shadow-md border-2 border-brand-green"
                                />
                                <span className="absolute top-0 right-0 bg-brand-green text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                    Atual
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">Imagem armazenada • Selecione nova para substituir</p>
                        </div>
                    )}

                    <div className="text-center">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="image-upload"
                            onChange={handleImageChange}
                        />
                        <label
                            htmlFor="image-upload"
                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded inline-block transition-colors"
                        >
                            {currentImageUrl ? 'Substituir Imagem' : 'Escolher Arquivo'}
                        </label>
                        {selectedImage && (
                            <p className="text-sm text-brand-green mt-2 font-medium">
                                ✓ {selectedImage.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Upload de Áudio */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <p className="text-gray-500 mb-2 text-center">Áudio Explicativo</p>

                    {/* Preview do áudio existente */}
                    {isEditing && currentAudioUrl && !selectedAudio && (
                        <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-brand-green">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-10 h-10 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-white bg-brand-green px-2 py-0.5 rounded">
                                            Áudio Atual
                                        </span>
                                    </div>
                                    <audio
                                        controls
                                        src={currentAudioUrl}
                                        className="w-full h-8"
                                        style={{ maxWidth: '100%' }}
                                    />
                                    <p className="text-xs text-gray-600 mt-1">Áudio armazenado • Selecione novo para substituir</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            id="audio-upload"
                            onChange={handleAudioChange}
                        />
                        <label
                            htmlFor="audio-upload"
                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded inline-block transition-colors"
                        >
                            {currentAudioUrl ? 'Substituir Áudio' : 'Escolher Arquivo'}
                        </label>
                        {selectedAudio && (
                            <p className="text-sm text-brand-green mt-2 font-medium">
                                ✓ {selectedAudio.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Transcrição / Texto Completo */}
                <div>
                    <label className="block text-brand-green text-sm font-bold mb-2" htmlFor="texto">
                        Texto / Transcrição
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-brand-green font-sans"
                        id="texto"
                        name="texto"
                        rows="10"
                        value={formData.texto}
                        onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        * A sincronização automática será gerada após o upload do áudio (Mock).
                    </p>
                </div>

                {/* Buttons - Reorganized: Cancel left, Save right */}
                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        onClick={handleCancelClick}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-brand-green hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Obra'}
                    </button>
                </div>
            </form>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-serif font-bold text-brand-green mb-4">
                            Deseja realmente cancelar?
                        </h3>
                        <p className="text-gray-700 mb-6">
                            Todas as alterações não salvas serão perdidas. Tem certeza que deseja cancelar?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={dismissCancelModal}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
                            >
                                Continuar Editando
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-4 py-2 bg-brand-red text-white rounded hover:bg-red-700 transition-colors font-medium"
                            >
                                Sim, Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminObraForm;
