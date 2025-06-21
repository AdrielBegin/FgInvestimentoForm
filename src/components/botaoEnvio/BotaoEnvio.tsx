export const BotaoEnvio: React.FC<BotaoEnvioProps> = ({
  isSubmitting,
  isCursoMentoria,
  setModalAssinaturaMentoriaAberta
}) => {
  if (isCursoMentoria) {
    return (
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-yellow-500 hover:from-green-700 hover:to-yellow-950 text-blue-600 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Finalizar Inscrição
        </button>
      </div>
    );
  }

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full py-3 px-4 bg-yellow-500 hover:from-green-700 hover:to-yellow-950 text-blue-600 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
      ${isSubmitting ? 'opacity-70 cursor-not-allowed flex justify-center items-center' : ''}`}
    >
      {isSubmitting ? 'Processando...' : 'Finalizar Inscrição'}
    </button>
  );
};