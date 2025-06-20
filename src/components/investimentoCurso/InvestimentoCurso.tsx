export const InvestimentoCurso: React.FC<InvestimentoCursoProps> = ({ isCursoMentoria }) => (
  <div className="bg-white/20 p-4 rounded-lg">
    <p className="text-sm opacity-90 mb-1">Investimento total</p>
    {isCursoMentoria ? (
      <p className="text-2xl font-bold">R$ 500,00</p>
    ) : (
      <p className="text-2xl font-bold">R$ 2.000,00</p>
    )}
    <p className="text-xs opacity-80 mt-1">ou parcele em até 12x com juros</p>
  </div>
);