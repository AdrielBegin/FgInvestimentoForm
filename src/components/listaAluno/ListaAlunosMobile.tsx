import { Aluno } from '@/src/types/Aluno';
import { FiUser, FiMail, FiMapPin, FiFileText, FiChevronDown, FiChevronUp } from 'react-icons/fi';


interface ListaAlunosMobileProps {
  alunosFiltrados: Aluno[];
  mobileOpenId: string | null;
  toggleMobileView: (id: string) => void;
  abrirModalEdicao: (id: string) => void;
}

export default function ListaAlunosMobile({
  alunosFiltrados,
  mobileOpenId,
  toggleMobileView,
  abrirModalEdicao
}: ListaAlunosMobileProps) {
  return (
    <div className="md:hidden">
      {alunosFiltrados.map((aluno) => (
        <div key={aluno.id} className="border-b border-gray-200 last:border-b-0">
          <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
            onClick={() => toggleMobileView(aluno.id)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <FiUser />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{aluno.nome}</div>
              </div>
            </div>
            {mobileOpenId === aluno.id ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </div>

          {mobileOpenId === aluno.id && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Email</p>
                  <p className="text-gray-900 flex items-center">
                    <FiMail className="mr-2 text-gray-400" />
                    {aluno.email}
                  </p>
                </div>
                {/* Outros campos... */}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => abrirModalEdicao(aluno.id)}
                  className="text-sm text-green-600 hover:text-green-900 px-3 py-1 border border-green-600 rounded"
                >
                  Editar
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-600 rounded">
                  Detalhes
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}