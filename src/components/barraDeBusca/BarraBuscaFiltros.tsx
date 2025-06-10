import { FiSearch, FiRefreshCw, FiDownload } from 'react-icons/fi';

interface BarraBuscaFiltrosProps {
  busca: string;
  setBusca: (value: string) => void;
  handleBuscar: () => void;
  carregarTodosAlunos: () => void;
  handleExportExcel: () => void;
  filtroStatus: string;
  setFiltroStatus: (value: string) => void;
  dataInicio: string;
  setDataInicio: (value: string) => void;
  dataFim: string;
  setDataFim: (value: string) => void;
}

export default function BarraBuscaFiltros({
  busca,
  setBusca,
  handleBuscar,
  carregarTodosAlunos,
  handleExportExcel,
  filtroStatus,
  setFiltroStatus,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim
}: BarraBuscaFiltrosProps) {
  return (
    <div className="p-4 md:p-6 border-b border-gray-200">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
            placeholder="Buscar por nome ou CPF..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>          
        
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBuscar}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FiSearch className="hidden sm:inline" />
            <span className="text-sm sm:text-base">Buscar</span>
          </button>

          <button
            onClick={carregarTodosAlunos}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FiRefreshCw className="hidden sm:inline" />
            <span className="text-sm sm:text-base">Recarregar</span>
          </button>
          
          <button
            onClick={handleExportExcel}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FiDownload />
            Exportar Excel
          </button>
        </div>
      </div>
    </div>
  );
}