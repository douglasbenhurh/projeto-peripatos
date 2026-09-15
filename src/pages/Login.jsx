import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Layout from '../components/Layout';
import { TEST_USERS } from '../data/users';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("Logged in as", user.email);

            // Store user info in localStorage for ProtectedRoute compatibility
            // In a full implementation, we should use an AuthContext
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: user.displayName || 'Usuário'
            }));

            navigate('/admin');
        } catch (error) {
            console.error("Login error:", error);
            let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';

            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Email ou senha inválidos.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Muitas tentativas falhas. Tente novamente mais tarde.';
            }

            setError(errorMessage);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-serif font-bold text-brand-yellow mb-6">O Escriba</h2>
                <p className="text-gray-500 mb-8 text-center">Cadastro e edição de artefatos.</p>

                <form onSubmit={handleLogin} className="w-full max-w-sm">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-brand-green text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-brand-green"
                            id="email"
                            type="email"
                            placeholder="tutor@nova-acropole.org.br"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-brand-green text-sm font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-brand-green"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="w-full bg-brand-green hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                            type="submit"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Login;
