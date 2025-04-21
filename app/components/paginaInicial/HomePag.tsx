import Image from "next/image";
import Link from "next/link";
import { Roboto } from "next/font/google";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaBookOpen, FaBitcoin, FaShieldAlt, FaChartLine, FaBullseye } from "react-icons/fa";
import fg from '@/app/logo/LogoFG.svg';
import quemSomos from '@/app/quemsomos.png'

const roboto = Roboto({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-roboto",
    display: "swap",
});

export default function Home() {
    return (
        <div className={`${roboto.className} font-sans text-gray-800 bg-gray-50`}>
            {/* Cabeçalho */}
            <header className="w-full bg-blue-600 py-2 px-6 sticky top-0 z-50 shadow-md flex justify-between items-center">
                <Image
                    src={fg}
                    alt="Logo"
                    width={100}
                    height={100}
                    className="filter brightness-0 invert"
                />
                <nav className="flex gap-4 items-center text-base">
                    <a href="#sobre" className="text-white hover:text-yellow-400 font-medium transition-colors">Sobre o Curso</a>
                    <a href="#quemsomos" className="text-white hover:text-yellow-400 font-medium transition-colors">Quem Somos</a>
                    <Link href="/login" className="text-white hover:text-yellow-400 font-medium transition-colors">
                        Login
                    </Link>
                </nav>
            </header>

            {/* Banner */}
            <section className="bg-blue-600 text-white py-28 px-6 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">Construa sua Carreira de Investidor</h1>
                    <p className="text-lg md:text-2xl mb-10 max-w-2xl mx-auto opacity-90">
                        O Curso CADI oferece um método exclusivo com material 100% apostilado, práticas em criptomoedas e gestão de risco.
                    </p>
                    <a
                        href="/login"
                        className="inline-block bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-colors"
                    >
                        Faça sua Inscrição
                    </a>
                </div>
            </section>

            {/* SOBRE O CURSO */}
            <section id="sobre" className="px-4 py-16 max-w-7xl mx-auto mt-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-10 text-blue-700 text-center">
                    O que você vai aprender no CADI
                </h2>
                <div className="
                            grid 
                            gap-6 
                            grid-cols-1
                            sm:grid-cols-2
                            md:grid-cols-3
                            lg:grid-cols-5
                            justify-items-center
                        ">
                    {/* 1 */}
                    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6 w-full max-w-[220px]">
                        <FaBookOpen className="text-blue-600 text-4xl mb-3" />
                        <h3 className="font-semibold text-lg mb-1 text-gray-800 text-center">Material 100% Apostilado</h3>
                        <p className="text-gray-600 text-sm text-center">Método FG School com material exclusivo e didático.</p>
                    </div>
                    {/* 2 */}
                    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6 w-full max-w-[220px]">
                        <FaBitcoin className="text-blue-600 text-4xl mb-3" />
                        <h3 className="font-semibold text-lg mb-1 text-gray-800 text-center">Prática em Criptomoedas</h3>
                        <p className="text-gray-600 text-sm text-center">Operações reais para aprender na prática o mercado de cripto.</p>
                    </div>
                    {/* 3 */}
                    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6 w-full max-w-[220px]">
                        <FaShieldAlt className="text-blue-600 text-4xl mb-3" />
                        <h3 className="font-semibold text-lg mb-1 text-gray-800 text-center">Gestão de Risco</h3>
                        <p className="text-gray-600 text-sm text-center">Aprenda a proteger seu capital e investir com segurança.</p>
                    </div>
                    {/* 4 */}
                    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6 w-full max-w-[220px]">
                        <FaChartLine className="text-blue-600 text-4xl mb-3" />
                        <h3 className="font-semibold text-lg mb-1 text-gray-800 text-center">Análise Técnica</h3>
                        <p className="text-gray-600 text-sm text-center">Leitura de gráficos e técnicas para identificar oportunidades.</p>
                    </div>
                    {/* 5 */}
                    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6 w-full max-w-[220px]">
                        <FaBullseye className="text-blue-600 text-4xl mb-3" />
                        <h3 className="font-semibold text-lg mb-1 text-gray-800 text-center">Indicadores e Estratégias</h3>
                        <p className="text-gray-600 text-sm text-center">Como usar indicadores e montar estratégias vencedoras.</p>
                    </div>
                </div>
            </section>


            {/* Seção Quem Somos */}
            <section id="quemsomos" className="py-20 px-6 bg-gray-100">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
                    <div>
                        <Image src={quemSomos} alt="Quem Somos" width={500} height={400} className="rounded-xl shadow-lg" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-blue-700">Quem Somos</h2>
                        <p className="text-lg leading-relaxed text-gray-700 mb-4">
                            Desde os primórdios, a humanidade busca crescimento financeiro e prosperidade por meio do trabalho e da multiplicação de recursos. Com a modernização, o mercado financeiro tornou-se mais acessível, mas o conhecimento necessário para aproveitá-lo ainda é privilégio de poucos.
                        </p>
                        <p className="text-lg leading-relaxed text-gray-700">
                            A FG SCHOOL surgiu para mudar esse cenário, oferecendo uma oportunidade igual para todos. Aqui, tanto aqueles com mais recursos quanto os que têm menos começam do mesmo ponto, aprendendo juntos a gerenciar suas finanças de forma eficiente e a construir um patrimônio sólido.
                        </p>
                    </div>
                </div>
            </section>

            {/* Rodapé */}
            <footer className="bg-blue-700 py-8 px-6 text-center text-white mt-12">
                <div className="flex justify-center gap-8 mb-4">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <FaInstagram className="text-3xl hover:text-yellow-400 transition" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <FaFacebook className="text-3xl hover:text-yellow-400 transition" />
                    </a>
                </div>
                <p className="text-sm opacity-80">© 2025 FG School. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}