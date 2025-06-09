import Link from 'next/link';

interface CabecalhoConsultaProps {
  titulo: string;
  subtitulo: string;
}

export default function CabecalhoConsulta({ titulo, subtitulo }: CabecalhoConsultaProps) {
  return (
    <div className="bg-blue-600 p-4 md:p-6 text-white">
      <h1 className="text-xl md:text-3xl font-bold">{titulo}</h1>
      <p className="text-sm md:text-base opacity-90">{subtitulo}</p>
      <div className="mt-4">
        <Link
          className="inline-block bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition-colors duration-200"
          href="/">
          Voltar para Tela Incial
        </Link>
      </div>
    </div>
  );
}