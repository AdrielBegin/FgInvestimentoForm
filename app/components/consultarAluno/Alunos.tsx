'use client';
import React, { useState, useContext, useEffect } from 'react';
import db from "@/app/config/firebaseClient";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { UserContext } from '@/app/components/providers/Providers';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import * as XLSX from 'xlsx';
import {
  FiSearch,
  FiUser,
  FiMail,
  FiMapPin,
  FiFileText,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiBook,
  FiDownload

} from 'react-icons/fi';

type Aluno = {
  id: string;
  nome: string;
  email: string;
  cidade: string;
  cpfCnpj: string;
  dataCadastro?: string;
  status?: string;
  modalidadeDeAula?: string;
};

export default function ConsultaAlunos() {

  const router = useRouter();
  const { user, loading } = useContext(UserContext);

  const [busca, setBusca] = useState('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);

  useEffect(() => {
    carregarTodosAlunos();
  }, []);

  const carregarTodosAlunos = async () => {
    setCarregando(true);
    const alunosRef = collection(db, 'Alunos');
    const querySnapshot = await getDocs(alunosRef);

    const resultados = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Aluno, 'id'>),
      dataCadastro: new Date(doc.data().timestamp?.toDate()).toLocaleDateString(),
      status: ['Ativo', 'Inativo', 'Pendente'][Math.floor(Math.random() * 3)]
    }));

    setAlunos(resultados);
    setCarregando(false);
  };

  const handleBuscar = async () => {
    if (!busca.trim()) {
      carregarTodosAlunos();
      return;
    }

    setCarregando(true);
    const alunosRef = collection(db, 'Alunos');

    const campo = /^\d+$/.test(busca) ? 'cpfCnpj' : 'nome';

    const q = query(alunosRef, where(campo, '>=', busca), where(campo, '<=', busca + '\uf8ff'));

    const querySnapshot = await getDocs(q);

    const resultados = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Aluno, 'id'>),
      dataCadastro: new Date(doc.data().timestamp?.toDate()).toLocaleDateString(),
      status: ['Ativo', 'Inativo', 'Pendente'][Math.floor(Math.random() * 3)]
    }));

    setAlunos(resultados);
    setCarregando(false);
  };
  const handleExportExcel = () => {
    // Configura os dados para exportar
    const dataToExport = alunos.map(aluno => ({
      Nome: aluno.nome,
      Email: aluno.email,
      Cidade: aluno.cidade,
      CpfCnpj: aluno.cpfCnpj,
      DataCadastro: aluno.dataCadastro,
      Status: aluno.status,
      ModalidadeDeAula: aluno.modalidadeDeAula,
    }));

    // Cria a worksheet e o workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alunos");

    // Exporta o arquivo
    XLSX.writeFile(workbook, "alunos.xlsx");
  };

  const alunosFiltrados = filtroStatus === 'todos'
    ? alunos
    : alunos.filter(aluno => aluno.status === filtroStatus);

  const toggleMobileView = (id: string) => {
    setMobileOpenId(mobileOpenId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 p-2 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 md:p-6 text-white">
            <h1 className="text-xl md:text-3xl font-bold">Consulta de Alunos</h1>
            <p className="text-sm md:text-base opacity-90">Gerencie e visualize os alunos cadastrados</p>
            <div className="mt-4">
              <Link
                className="inline-block bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition-colors duration-200"
                href="/">
                Voltar para Tela Incial
              </Link>
            </div>
          </div>

          {/* Barra de busca e filtros */}
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

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="hidden w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="todos">Todos os status</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Pendente">Pendente</option>
                  </select>
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
          </div>

          {/* Data Grid */}
          <div className="overflow-x-auto">
            {carregando ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : alunosFiltrados.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Nenhum aluno encontrado. Tente ajustar sua busca ou filtros.
              </div>
            ) : (
              <>
                {/* Desktop View (hidden on mobile) */}
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
                          Localização
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CPF/CNPJ
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modalidade de Aula
                        </th>
                        <th scope="col" className="hidden px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                          Status
                        </th>
                        <th scope="col" className="hidden px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                              {aluno.cidade}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiFileText className="mr-2 text-gray-400" />
                              {aluno.cpfCnpj}
                            </div>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center min-w-[120px]">  {/* Adicionei min-width */}
                              <FiBook className="mr-2 text-gray-400" />  {/* Ícone mais apropriado */}
                              <span className="truncate">{aluno.modalidadeDeAula}</span>  {/* Evita overflow */}
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
                          <td className=" hidden px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900 mr-3">Editar</button>
                            <button className="text-blue-600 hover:text-blue-900">Detalhes</button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View (hidden on desktop) */}
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
                            <div className="text-xs text-gray-500">
                              <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full 
                                ${aluno.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                                  aluno.status === 'Inativo' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'}`}>
                                {aluno.status}
                              </span>
                            </div>
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
                            <div>
                              <p className="text-gray-500 font-medium">Cidade</p>
                              <p className="text-gray-900 flex items-center">
                                <FiMapPin className="mr-2 text-gray-400" />
                                {aluno.cidade}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium">CPF/CNPJ</p>
                              <p className="text-gray-900 flex items-center">
                                <FiFileText className="mr-2 text-gray-400" />
                                {aluno.cpfCnpj}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium">Cadastro</p>
                              <p className="text-gray-900">{aluno.dataCadastro || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button className="text-sm text-green-600 hover:text-green-900 px-3 py-1 border border-green-600 rounded">
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
              </>
            )}
          </div>

          {/* Paginação */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <button className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de{' '}
                  <span className="font-medium">{alunosFiltrados.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button aria-current="page" className="z-10 bg-green-50 border-green-500 text-green-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    3
                  </button>
                  <span className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 sm:px-4">
                    ...
                  </span>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-2 py-2 border text-sm font-medium sm:px-4">
                    8
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Próximo</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}