'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Roboto } from "next/font/google";
import ConsultaAlunos from '@/app/components/consultarAluno/Alunos';
import ConsultaPagamentos from '@/app/components/consultarPagamento/PagamentosConsulta';
import fg from '@/app/logo/FgSemFundo.png';

// Configurando a fonte Roboto
const roboto = Roboto({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-roboto",
    display: "swap",
});

export default function TelaAdmin() {
    const [activeTab, setActiveTab] = useState('alunos');
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
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

    return (
        <>
            <Head>
                <title>Painel do Administrador</title>
                <meta name="description" content="Gerenciamento de alunos e pagamentos no painel administrativo." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={`${roboto.className} font-sans text-gray-800 bg-gray-50`}>
                <header
                    className={`w-full bg-blue-600 py-3 px-6 sticky top-0 z-50 shadow-md flex justify-between items-center transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'
                        }`}
                >
                    <Image
                        src={fg}
                        alt="Logo"
                        width={100}
                        height={100}
                        className="filter brightness-0 invert"
                    />

                    <nav className="flex gap-4 items-center">
                        <button
                            onClick={() => setActiveTab('alunos')}
                            className={`px-4 py-2 rounded-md transition-colors duration-300 ${activeTab === 'alunos' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'
                                }`}
                        >
                            Consultar Alunos
                        </button>
                        <button
                            onClick={() => setActiveTab('pagamentos')}
                            className={`px-4 py-2 rounded-md transition-colors duration-300 ${activeTab === 'pagamentos' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'
                                }`}
                        >
                            Consultar Pagamentos
                        </button>
                    </nav>
                </header>
                <div className="p-6">
                    {activeTab === 'alunos' ? <ConsultaAlunos /> : <ConsultaPagamentos />}
                </div>
            </div>
        </>
    );
}