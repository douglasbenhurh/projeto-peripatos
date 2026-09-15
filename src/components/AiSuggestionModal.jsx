import React from 'react';

/**
 * Modal genérico para exibir e confirmar sugestões de IA
 */
const AiSuggestionModal = ({
    isOpen,
    title,
    suggestion,
    loading,
    error,
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                <h3 className="text-xl font-serif font-bold text-brand-green mb-4 flex items-center gap-2">
                    <span>✨</span>
                    {title}
                </h3>

                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mb-3"></div>
                        <p className="text-gray-600">Gerando sugestão...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        <p className="font-semibold">Erro</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!loading && !error && suggestion && (
                    <div className="mb-6">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed">{suggestion}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            💡 Sugestão gerada por inteligência artificial
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    {!loading && !error && suggestion && (
                        <button
                            onClick={() => onConfirm(suggestion)}
                            className="px-4 py-2 bg-brand-green text-white rounded hover:bg-opacity-90 transition-colors font-medium"
                        >
                            Usar Sugestão
                        </button>
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

export default AiSuggestionModal;
