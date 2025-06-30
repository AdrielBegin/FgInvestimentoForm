'use client';
import { FiUser, FiMail, FiMapPin, FiFileText, FiBook } from 'react-icons/fi';

import { Aluno } from '@/src/types/Aluno';
import ModalEdicaoAluno from '../modals/ModalEdicaoAluno';
import ModalExcluirAluno from '../modals/ModalExcluirAluno';

interface TabelaAlunosDesktopProps {
  alunosFiltrados: Aluno[];
  abrirModalEdicao: (id: string) => void;
  abrirModalExclusao: (id: string) => void;
  modalEdicaoAberto: boolean;
  modalExclusaoAberto: boolean;
  setModalEdicaoAberto: (value: boolean) => void;
  setModalExclusaoAberto: (value: boolean) => void;
  alunoSelecionado: string | null;
  handleAtualizacao: () => void;
  handleExclusao: () => void;

}

export default function TabelaAlunosDesktop({
  alunosFiltrados,
  abrirModalEdicao,
  abrirModalExclusao,
  modalEdicaoAberto,
  modalExclusaoAberto,
  setModalEdicaoAberto,
  setModalExclusaoAberto,
  alunoSelecionado,
  handleAtualizacao,
  handleExclusao
}: TabelaAlunosDesktopProps) {
  return (
    <div className="hidden md:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aluno
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contato
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profissão
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Celular/Telefone
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CEP
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cidade
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lougradouro
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Numero da Casa
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CPF/CNPJ
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modalidade de Aula
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Cadastro
            </th>
            <th scope="col" className="hidden px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
              Status
            </th>
            <th scope="col" className=" px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {alunosFiltrados.map((aluno) => (
            <tr key={aluno.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <FiUser />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{aluno.nome}</div>
                    <div className="text-xs text-gray-500">ID: {aluno.id.substring(0, 8)}...</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FiMail className="mr-2 text-gray-400" />
                  {aluno.email}
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FiMapPin className="mr-2 text-gray-400" />
                  {aluno.profissao}
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FiMapPin className="mr-2 text-gray-400" />
                  {aluno.numeroContato}
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FiMapPin className="mr-2 text-gray-400" />
                  {aluno.cep}
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FiMapPin className="mr-2 text-gray-400" />
                  {aluno.estado}
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FiMapPin className="mr-2 text-gray-400" />
                  {aluno.cidade}
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FiMapPin className="mr-2 text-gray-400" />
                  {aluno.logradouro}
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <FiFileText className="mr-2 text-gray-400" />
                  {aluno.numeroCasa}
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center min-w-[120px]">
                  <FiBook className="mr-2 text-gray-400" />
                  <span className="truncate">{aluno.cpfCnpj}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center min-w-[120px]">
                  <FiBook className="mr-2 text-gray-400" />
                  <span className="truncate">{aluno.modalidadeDeAula}</span>
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center min-w-[120px]">
                  <FiBook className="mr-2 text-gray-400" />
                  <span className="truncate">{aluno.dataCadastro}</span>
                </div>
              </td>

              <td className=" hidden px-4 py-4 whitespace-nowrap">
                <span className={` px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${aluno.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                    aluno.status === 'Inativo' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                  {aluno.status}
                </span>
              </td>
              <td className=" px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => abrirModalEdicao(aluno.id)} className="text-green-600 hover:text-green-900 mr-3">Editar</button>
                <button onClick={() => abrirModalExclusao(aluno.id)} className="text-red-600 hover:text-red-900">Excluir</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalExcluirAluno
        isOpen={modalExclusaoAberto}
        onClose={() => setModalExclusaoAberto(false)}
        alunoId={alunoSelecionado || ''}
        alunoNome={alunoSelecionado || ''}
        onUpdate={handleExclusao}
      />

      <ModalEdicaoAluno
        isOpen={modalEdicaoAberto}
        onClose={() => setModalEdicaoAberto(false)}
        alunoId={alunoSelecionado || ''}
        onUpdate={handleAtualizacao}
      />
    </div>
  );
}