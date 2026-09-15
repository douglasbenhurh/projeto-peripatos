import React from 'react';

/**
 * Modal para exibir e selecionar imagem do Unsplash
 */
const ImageSearchModal = ({
    isOpen,
    imageData,
    loading,
    error,
    onSelectImage,
    onCancel,
    onNext
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                <h3 className="text-xl font-serif font-bold text-brand-green mb-4 flex items-center gap-2">
                    <span>🔍</span>
                    Imagem Sugerida
                </h3>

                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mb-4"></div>
                        <p className="text-gray-600">Buscando imagem...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        <p className="font-semibold">Erro</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!loading && !error && imageData && (
                    <div className="mb-6">
                        <div className="rounded-lg overflow-hidden shadow-md mb-4 max-h-[400px] flex items-center justify-center bg-gray-100">
                            <img
                                src={imageData.url}
                                alt={imageData.description}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>

                        {imageData.description && (
                            <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                                <strong>Descrição:</strong> {imageData.description}
                            </p>
                        )}

                        <p className="text-xs text-gray-500">
                            📷 Foto por{' '}
                            <a
                                href={imageData.photographer.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-green hover:underline"
                            >
                                {imageData.photographer.name}
                            </a>
                            {' '}no Unsplash
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                        Cancelar
                    </button>

                    {!loading && !error && imageData && (
                        <>
                            <button
                                onClick={onNext}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium transition-colors flex items-center gap-2"
                            >
                                🔄 Próxima
                            </button>
                            <button
                                onClick={() => onSelectImage(imageData)}
                                className="px-4 py-2 bg-brand-green text-white rounded hover:bg-opacity-90 transition-colors font-medium"
                            >
                                Usar Esta Imagem
                            </button>
                        </>
                    )}

                    {error && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-brand-green text-white rounded hover:bg-opacity-90 transition-colors font-medium"
                        >
                            Fechar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageSearchModal;
