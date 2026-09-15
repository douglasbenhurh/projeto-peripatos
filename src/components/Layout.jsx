import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-nova-acropole.png';

const Layout = ({ children, hideHeader = false }) => {
    return (
        <div className="min-h-screen bg-brand-white flex flex-col items-center py-8 px-4">
            {!hideHeader && (
                <header className="mb-8 text-center w-full max-w-2xl">
                    <Link to="/" className="block group">
                        <img
                            src={logo}
                            alt="Nova Acrópole"
                            className="h-16 md:h-20 mx-auto mb-4 transition-opacity group-hover:opacity-80"
                        />
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-green transition-colors group-hover:text-opacity-80">
                            PERIPATOS
                        </h1>
                    </Link>
                </header>
            )}


            <main className="w-full max-w-md md:max-w-2xl bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                {children}
            </main>

            <footer className="mt-12 text-center text-xs text-gray-400">
                <p>&copy; {new Date().getFullYear()} Nova Acrópole. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Layout;
