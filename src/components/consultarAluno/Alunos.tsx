'use client';
import React, { useState, useContext, useEffect } from 'react';
import db from "@/src/app/config/firebaseClient";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { UserContext } from '@/src/components/providers/Providers';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import Paginacao from '../paginacao/Paginacao';
import ListaAlunosMobile from '../listaAluno/ListaAlunosMobile';
import TabelaAlunosDesktop from '../tabelaAlunos/TabelaAlunos';
import BarraBuscaFiltros from '../barraDeBusca/BarraBuscaFiltros';
import CabecalhoConsulta from '../headerConsultaAlunos/CabecalhoConsulta';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Aluno = {
  id: string;
  nome: string;
  email: string;
  cidade: string;
  cep: string;
  estado: string;
  logradouro: string;
  numeroCasa: string;
  profissao: string;
  cpfCnpj: string;
  dataCadastro?: string;
  status?: string;
  modalidadeDeAula?: string;
  numeroContato?: string;
};

export default function ConsultaAlunos() {

  const router = useRouter();
  const { user, loading } = useContext(UserContext);
  const [busca, setBusca] = useState('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);


  useEffect(() => {
    carregarTodosAlunos();
  }, []);

  const abrirModalEdicao = (alunoId: string) => {
    setAlunoSelecionado(alunoId);
    setModalEdicaoAberto(true);
  };
  const abrirModalExclusao = (alunoId: string) => {
    setAlunoSelecionado(alunoId);
    setModalExclusaoAberto(true);
  };

  const handleAtualizacao = () => {
    toast.success('Aluno atualizado com sucesso!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

    const handleExclusao = () => {
    toast.success('Aluno excluido com sucesso!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const carregarTodosAlunos = async () => {
    setCarregando(true);
    const alunosRef = collection(db, 'alunos');
    const querySnapshot = await getDocs(alunosRef);

    const resultados = querySnapshot.docs
      .filter(doc => doc.data().excluido !== true)
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.nome || "",
          email: data.email || "",
          cidade: data.cidade || "",
          profissao: data.profissao || "",
          numeroContato: data.numeroContato || "",
          estado: data.estado || "",
          cep: data.cep || "",
          logradouro: data.logradouro || "",
          cpfCnpj: data.cpfCnpj || "",
          numeroCasa: data.numeroCasa || "",
          modalidadeDeAula: data.modalidadeDeAula || "Não informado",
          dataCadastro: parseDataHoraPtBr(data.dataCadastro),
          status: ['Ativo', 'Inativo', 'Pendente'][Math.floor(Math.random() * 3)]
        } as Aluno;
      })

    setAlunos(resultados);
    setCarregando(false);
  };

  const parseDataHoraPtBr = (dataStr: string): string => {
    const [data, hora] = dataStr.split(','); // ["27/04/2025", " 08:58:07"]
    const [dia, mes, ano] = data.trim().split('/');
    const dataIso = `${ano}-${mes}-${dia}T${hora.trim()}`; // "2025-04-27T08:58:07"
    const dataObj = new Date(dataIso);

    return isNaN(dataObj.getTime())
      ? 'Data inválida'
      : dataObj.toLocaleString("pt-BR", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
  };

  const handleBuscar = async () => {
    if (!busca.trim()) {
      carregarTodosAlunos();
      return;
    }

    setCarregando(true);
    const alunosRef = collection(db, 'alunos');

    const campo = /^\d+$/.test(busca) ? 'cpfCnpj' : 'nome';

    const q = query(alunosRef, where(campo, '>=', busca), where(campo, '<=', busca + '\uf8ff'));

    const querySnapshot = await getDocs(q);

    const resultados = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Aluno, 'id'>),
      dataCadastro: doc.data().dataCadastro.toLocaleDateString("pt-BR"),
      status: ['Ativo', 'Inativo', 'Pendente'][Math.floor(Math.random() * 3)]
    }));

    setAlunos(resultados);
    setCarregando(false);
  };
  const handleExportExcel = () => {
    const dataToExport = alunos.map(aluno => ({
      Nome: aluno.nome,
      Email: aluno.email,
      CpfCnpj: aluno.cpfCnpj,
      Celular_Telefone: aluno.numeroContato,
      CEP: aluno.cep,
      Cidade: aluno.cidade,
      Estado: aluno.estado,
      Logradouro: aluno.logradouro,
      DataCadastro: aluno.dataCadastro,
      ModelidadeAula: aluno.modalidadeDeAula,
      Status: aluno.status,
      ModalidadeDeAula: aluno.modalidadeDeAula,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "alunos");
    XLSX.writeFile(workbook, "alunos.xlsx");
  };

  const alunosFiltrados = filtroStatus === 'todos'
    ? alunos
    : alunos.filter(aluno => aluno.status === filtroStatus);

  const toggleMobileView = (id: string) => {
    setMobileOpenId(mobileOpenId === id ? null : id);
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 p-2 md:p-6 lg:p-10 xl:p-12">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <CabecalhoConsulta
            titulo="Consulta de Alunos"
            subtitulo="Gerencie e visualize os alunos cadastrados"
          />

          <BarraBuscaFiltros
            busca={busca}
            setBusca={setBusca}
            handleBuscar={handleBuscar}
            carregarTodosAlunos={carregarTodosAlunos}
            handleExportExcel={handleExportExcel}
            filtroStatus={filtroStatus}
            setFiltroStatus={setFiltroStatus}
          />

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
                <TabelaAlunosDesktop
                  alunosFiltrados={alunosFiltrados}
                  abrirModalEdicao={abrirModalEdicao}
                  abrirModalExclusao={abrirModalExclusao}
                  modalEdicaoAberto={modalEdicaoAberto}
                  modalExclusaoAberto={modalExclusaoAberto}
                  setModalEdicaoAberto={setModalEdicaoAberto}
                  setModalExclusaoAberto={setModalExclusaoAberto}
                  alunoSelecionado={alunoSelecionado}
                  handleAtualizacao={handleAtualizacao}
                  handleExclusao={handleExclusao}
                />

                <ListaAlunosMobile
                  alunosFiltrados={alunosFiltrados}
                  mobileOpenId={mobileOpenId}
                  toggleMobileView={toggleMobileView}
                  abrirModalEdicao={abrirModalEdicao}
                />
              </>
            )}
          </div>
          <Paginacao totalItens={alunosFiltrados.length} />
        </div>
      </div>
    </div>
  );
}