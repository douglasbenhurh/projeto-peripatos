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

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-brand-green">Acervo</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            auth.signOut();
                            window.location.href = '/login';
                        }}
                        className="text-gray-600 hover:text-brand-red font-medium px-4 py-2"
                    >
                        Sair
                    </button>
                    <Link
                        to="/admin/nova-obra"
                        className="bg-brand-yellow text-brand-green font-bold py-2 px-4 rounded hover:bg-opacity-80 transition-colors"
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
                /* Mobile-responsive table wrapper */
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Obra
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Localização
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {obras.map((obra) => (
                                    <tr key={obra.id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <p className="text-gray-900 whitespace-no-wrap font-medium">
                                                        {obra.titulo}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{obra.localizacao}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
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
