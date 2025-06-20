export const CabecalhoFormulario: React.FC<CabecalhoFormularioProps> = ({ titulo, subtitulo }) => (
  <>
    <h1 className="text-2xl font-bold text-gray-800 mb-2">{titulo}</h1>
    <p className="text-gray-600 mb-6">{subtitulo}</p>
  </>
);