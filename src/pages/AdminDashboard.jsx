import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Layout from '../components/Layout';

const AdminDashboard = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [obraToDelete, setObraToDelete] = useState(null);
    const [obras, setObras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedObras, setSelectedObras] = useState([]);

    // Buscar obras do Firestore
    useEffect(() => {
        const fetchObras = async () => {
            try {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, 'obras'));
                const obrasData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setObras(obrasData);
            } catch (err) {
                console.error('Erro ao buscar obras:', err);
                setError('Erro ao carregar obras');
            } finally {
                setLoading(false);
            }
        };

        fetchObras();
    }, []);

    const handleDeleteClick = (obra) => {
        setObraToDelete(obra);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (obraToDelete) {
            try {
                // Deletar do Firestore
                await deleteDoc(doc(db, 'obras', obraToDelete.id));

                // Atualizar estado local
                setObras(obras.filter(o => o.id !== obraToDelete.id));
                setSelectedObras(selectedObras.filter(id => id !== obraToDelete.id));
                console.log('Obra excluída com sucesso:', obraToDelete.id);
            } catch (err) {
                console.error('Erro ao excluir obra:', err);
                setError('Erro ao excluir obra. Tente novamente.');
            }
        }
        setShowDeleteModal(false);
        setObraToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setObraToDelete(null);
    };

    // Selection Handlers
    const toggleSelectAll = () => {
        if (selectedObras.length === obras.length) {
            setSelectedObras([]);
        } else {
            setSelectedObras(obras.map(o => o.id));
        }
    };

    const toggleSelectObra = (id) => {
        if (selectedObras.includes(id)) {
            setSelectedObras(selectedObras.filter(oId => oId !== id));
        } else {
            setSelectedObras([...selectedObras, id]);
        }
    };

    const handleBatchPrint = () => {
        if (selectedObras.length === 0) return;
        const ids = selectedObras.join(',');
        window.open(`/admin/etiqueta?ids=${ids}`, '_blank');
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-serif font-bold text-brand-green self-start md:self-center">Acervo</h2>
                <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto justify-end">
                    {selectedObras.length > 0 && (
                        <button
                            onClick={handleBatchPrint}
                            className="bg-brand-green text-white font-bold py-2 px-4 rounded hover:bg-opacity-80 transition-colors flex items-center gap-2 text-sm md:text-base flex-1 md:flex-none justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                            </svg>
                            Imprimir ({selectedObras.length})
                        </button>
                    )}
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            auth.signOut();
                            window.location.href = '/login';
                        }}
                        className="text-gray-600 hover:text-brand-red font-medium px-4 py-2 text-sm md:text-base"
                    >
                        Sair
                    </button>
                    <Link
                        to="/admin/nova-obra"
                        className="bg-brand-yellow text-brand-green font-bold py-2 px-4 rounded hover:bg-opacity-80 transition-colors text-sm md:text-base flex-1 md:flex-none text-center"
                    >
                        + Nova Obra
                    </Link>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-brand-red text-brand-red px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">Carregando obras...</p>
                </div>
            ) : obras.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">Nenhuma obra cadastrada ainda.</p>
                </div>
            ) : (
                <>
                    {/* Mobile Card Layout */}
                    <div className="md:hidden space-y-4">
                        <div className="flex justify-between items-center px-2 mb-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={selectedObras.length === obras.length && obras.length > 0}
                                    onChange={toggleSelectAll}
                                    className="rounded text-brand-green focus:ring-brand-green h-4 w-4"
                                />
                                Selecionar Todos
                            </label>
                        </div>
                        {obras.map((obra) => (
                            <div key={obra.id} className={`bg-white rounded-lg shadow border ${selectedObras.includes(obra.id) ? 'border-brand-green ring-1 ring-brand-green' : 'border-gray-100'} p-4 transition-all`}>
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="pt-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedObras.includes(obra.id)}
                                            onChange={() => toggleSelectObra(obra.id)}
                                            className="rounded text-brand-green focus:ring-brand-green h-5 w-5"
                                        />
                                    </div>
                                    {obra.imagemUrl && (
                                        <img
                                            src={obra.imagemUrl}
                                            alt={obra.titulo}
                                            className="w-20 h-20 object-cover rounded border-2 border-brand-green"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-gray-900 font-medium text-base leading-tight">
                                            {obra.titulo}
                                        </h3>
                                        {obra.descricao && (
                                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                                {obra.descricao}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-8">
                                    <Link
                                        to={`/admin/etiqueta?id=${obra.id}&title=${encodeURIComponent(obra.titulo)}`}
                                        className="flex-1 text-center text-xs bg-brand-yellow text-brand-green font-semibold py-2 px-3 rounded hover:bg-opacity-80 transition-colors"
                                    >
                                        Etiqueta
                                    </Link>
                                    <Link
                                        to={`/admin/editar/${obra.id}`}
                                        className="flex-1 text-center text-xs bg-brand-blue text-white font-semibold py-2 px-3 rounded hover:bg-opacity-90 transition-colors"
                                    >
                                        Editar
                                    </Link>
                                    <Link
                                        to={`/obra?id=${obra.id}`}
                                        className="flex-1 text-center text-xs bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded hover:bg-gray-300 transition-colors"
                                        target="_blank"
                                    >
                                        Ver
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteClick(obra)}
                                        className="flex-1 text-xs bg-brand-red text-white font-semibold py-2 px-3 rounded hover:bg-red-700 transition-colors"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table Layout */}
                    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10">
                                            <input
                                                type="checkbox"
                                                checked={selectedObras.length === obras.length && obras.length > 0}
                                                onChange={toggleSelectAll}
                                                className="rounded text-brand-green focus:ring-brand-green h-4 w-4"
                                            />
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Obra
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {obras.map((obra) => (
                                        <tr key={obra.id} className={selectedObras.includes(obra.id) ? 'bg-green-50' : ''}>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedObras.includes(obra.id)}
                                                    onChange={() => toggleSelectObra(obra.id)}
                                                    className="rounded text-brand-green focus:ring-brand-green h-4 w-4"
                                                />
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <div className="flex items-center">
                                                    <div className="ml-3">
                                                        <p className="text-gray-900 whitespace-no-wrap font-medium">
                                                            {obra.titulo}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm text-right">
                                                <Link
                                                    to={`/admin/etiqueta?id=${obra.id}&title=${encodeURIComponent(obra.titulo)}`}
                                                    className="text-brand-yellow hover:text-brand-green mr-3"
                                                >
                                                    Etiqueta
                                                </Link>
                                                <Link
                                                    to={`/admin/editar/${obra.id}`}
                                                    className="text-brand-blue hover:text-brand-green mr-3"
                                                >
                                                    Editar
                                                </Link>
                                                <Link
                                                    to={`/obra?id=${obra.id}`}
                                                    className="text-gray-400 hover:text-brand-green mr-3"
                                                    target="_blank"
                                                >
                                                    Ver
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(obra)}
                                                    className="text-brand-red hover:text-red-700 font-medium"
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-serif font-bold text-brand-green mb-4">
                            Confirmar Exclusão
                        </h3>
                        <p className="text-gray-700 mb-6">
                            Tem certeza que deseja excluir a obra <strong>"{obraToDelete?.titulo}"</strong>?
                            Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-brand-red text-white rounded hover:bg-red-700 transition-colors font-medium"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminDashboard;
