export const ResumoPagamento: React.FC<ResumoPagamentoProps> = ({ isCursoMentoria }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <div className="flex justify-between items-center">
      <span className="font-medium text-gray-700">Valor Total:</span>
      {isCursoMentoria ? (
        <span className="text-xl font-bold text-green-600">R$ 500,00</span>
      ) : (
        <span className="text-xl font-bold text-green-600">R$ 2.000,00</span>
      )}
    </div>
    <p className="text-sm text-gray-500 mt-1 text-right">
      Pagamento único ou parcele no cartão
    </p>
  </div>
);