'use client';

import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Roboto } from "next/font/google";
import ConsultaAlunos from '@/app/components/consultarAluno/Alunos';
import ConsultaPagamentos from '@/app/components/consultarPagamento/PagamentosConsulta';
import fg from '@/app/logo/FgSemFundo.png';
import { UserContext } from '@/app/components/providers/Providers'; 
import { useRouter } from 'next/navigation';
import { FiUser, FiDollarSign, FiMenu, FiX, FiLogOut } from 'react-icons/fi';

const roboto = Roboto({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-roboto",
    display: "swap",
});

export default function TelaAdmin() {
    const { user, loading, logout } = useContext(UserContext);
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('alunos');
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
       
    useEffect(() => {        
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.role !== 'admin') {
            router.push('/login');
            return;
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Efeito de blur/glass quando scrollar
            if (currentScrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // Esconder/mostrar header
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);
    
    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Carregando...</p>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <>
            <Head>
                <title>Painel do Administrador</title>
                <meta name="description" content="Gerenciamento de alunos e pagamentos no painel administrativo." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={`${roboto.className} font-sans text-gray-800 bg-gray-50 flex flex-col min-h-screen`}>
                {/* Header Moderno */}
                <header
                    className={`fixed w-full py-3 px-6 z-50 transition-all duration-500 ${
                        showHeader ? 'top-0' : '-top-24'
                    } ${
                        scrolled ? 'backdrop-blur-md bg-blue-600/90' : 'bg-blue-600'
                    }`}
                >
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Image
                                src={fg}
                                alt="Logo"
                                width={80}
                                height={80}
                                className="filter brightness-0 invert hover:scale-105 transition-transform"
                            />
                            <span className="text-white font-bold hidden md:block text-xl">Painel Admin</span>
                        </div>

                        {/* Menu Desktop */}
                        <nav className="hidden md:flex items-center space-x-2">
                            <a
                                onClick={() => setActiveTab('alunos')}
                                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                                    activeTab === 'alunos' 
                                        ? 'bg-white text-blue-600 shadow-md' 
                                        : 'text-white hover:bg-blue-500/50'
                                }`}
                            >
                                <FiUser className="mr-2" />
                                Alunos
                            </a>
                            <a
                                onClick={() => setActiveTab('pagamentos')}
                                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                                    activeTab === 'pagamentos' 
                                        ? 'bg-white text-blue-600 shadow-md' 
                                        : 'text-white hover:bg-blue-500/50'
                                }`}
                            >
                                <FiDollarSign className="mr-2" />
                                Pagamentos
                            </a>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-red-500/50 transition-all duration-300"
                            >
                                <FiLogOut className="mr-2" />
                                Sair
                            </button>
                        </nav>

                        {/* Botão Mobile */}
                        <button 
                            className="md:hidden text-white p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>

                    {/* Menu Mobile */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4">
                            <div className="flex flex-col space-y-2">
                                <a
                                    onClick={() => {
                                        setActiveTab('alunos');
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                                        activeTab === 'alunos' 
                                            ? 'bg-white text-blue-600' 
                                            : 'text-white hover:bg-blue-500/50'
                                    }`}
                                >
                                    <FiUser className="mr-3" />
                                    Alunos
                                </a>
                                <a
                                    onClick={() => {
                                        setActiveTab('pagamentos');
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                                        activeTab === 'pagamentos' 
                                            ? 'bg-white text-blue-600' 
                                            : 'text-white hover:bg-blue-500/50'
                                    }`}
                                >
                                    <FiDollarSign className="mr-3" />
                                    Pagamentos
                                </a>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-4 py-3 rounded-lg text-white hover:bg-red-500/50 transition-all duration-300 text-left"
                                >
                                    <FiLogOut className="mr-3" />
                                    Sair
                                </button>
                            </div>
                        </div>
                    )}
                </header>

                {/* Conteúdo */}
                <main className="flex-grow pt-24 pb-10 px-6 max-w-7xl mx-auto">
                    {activeTab === 'alunos' ? <ConsultaAlunos /> : <ConsultaPagamentos />}
                </main>

                {/* Footer Minimalista */}
                <footer className="bg-blue-600 text-white py-4 text-center">
                    <p className="text-sm">© {new Date().getFullYear()} </p>
                </footer>                
            </div>
        </>
    );
}