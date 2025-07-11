"use client";
import React, { useState, useContext, useEffect } from 'react';
import useMercadoPago from "@/src/app/hooks/useMercadoPago";
import Image from 'next/image';
import fg from '@/public/logo/LogoFG.svg'
import axios from 'axios';
import { UserContext } from "../providers/Providers";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Script from 'next/script';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalAssinaturaMentoria from '../modals/ModalAssinaturaMentoria';

export default function FormularioMercadoPago() {

  const router = useRouter();

  const { user, loading } = useContext(UserContext);
  const [modalAssinaturaMentoriaAberta, setModalAssinaturaMentoriaAberta] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/routes/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  const { createMercadoPagoCheckout } = useMercadoPago();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: uuidv4(),
    nome: '',
    email: '',
    curso: '',
    valor: 2000,
    cpfCnpj: '',
    cep: '',
    estado: '',
    cidade: '',
    modalidadeDeAula: '',
    dataCadastro: new Date().toLocaleString(),
    statusPagemento: '',
    profissao: '',
    logradouro: '',
    numeroCasa: '',
    numeroContato: '',
    excluido: false,
    turma: '',
    matricula: ''
  });

  const modalidadeDeAulas = [
    { value: 'Presencial', label: 'Presencial' },
    { value: 'Online', label: 'Online' }
  ]

  const cursos = [
    { value: 'cursoCadi', label: 'Curso CADI - Carreira do Investidor (R$ 2.000,00)' },
    { value: 'mentoria', label: 'Mentoria (R$ 500.00)' }
  ]

  const isCursoMentoria = formData.curso === "mentoria";

  const getCpfCnpjMask = (value: string): string => {
    const numeric = value.replace(/\D/g, '');

    if (numeric.length <= 11) {
      return numeric
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return numeric
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  const handlePhoneChange = (e: any) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    }

    setFormData((prev) => ({
      ...prev,
      numeroContato: value,
    }));
  };

  const saveToFirebase = async () => {
    try {
      const response = await fetch('/api/firebase-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCepChange = async (e: any) => {
    const cep = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, cep: e.target.value }));

    if (cep.length === 8) {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.data.erro) {
        setFormData((prev) => ({
          ...prev,
          estado: response.data.uf,
          cidade: response.data.localidade,
          logradouro: response.data.logradouro,
        }));
      }
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === 'cpfCnpj') {
      const maskedValue = getCpfCnpjMask(value);
      setFormData(prev => ({
        ...prev,
        [name]: maskedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    setIsSubmitting(true);

    try {

      toast.info('Processando sua inscrição...', {
        autoClose: false,
        toastId: 'submitting'
      });

      await saveToFirebase();

      if (formData.curso !== "mentoria") {

        await createMercadoPagoCheckout({
          userId: formData.email,
          userEmail: formData.email,
          name: formData.nome,
          productName: formData.curso,
          productPrice: formData.valor
        });

        toast.dismiss('submitting');

        toast.success('Redirecionando para o pagamento!');

      } else if (formData.curso === "mentoria") {
        setModalAssinaturaMentoriaAberta(true)

        toast.dismiss('submitting');

        toast.success('Redirecionando para o pagamento!');
      }

    } catch (error) {

      toast.dismiss('submitting');
      toast.error('Ocorreu um erro ao processar sua inscrição. Tente novamente.');
      console.error(error);
    } finally {

      setIsSubmitting(false);
    }

  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 flex items-center justify-center p-4">
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

      <Script
        src="https://www.mercadopago.com/v2/security.js"
        data-view="item"
        strategy="afterInteractive"
      />
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Course Information */}
          <div className="w-full md:w-2/5 bg-blue-600 p-8 text-white">
            <div className="mb-6 flex justify-center">
              <Image
                src={fg}
                alt="Logo da empresa"
                width={150}
                height={150}
                className="filter brightness-0 invert"
              />
            </div>

            <h2 className="text-2xl font-bold mb-4">Curso CADI</h2>
            <h3 className="text-xl font-semibold mb-6">Carreira do Investidor</h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center mr-3 mt-1">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Materiais exclusivos</span>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center mr-3 mt-1">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Suporte especializado</span>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <p className="text-sm opacity-90 mb-1">Investimento total</p>
              {isCursoMentoria ? (
                <p className="text-2xl font-bold">R$ 500.00</p>
              ) : (
                <p className="text-2xl font-bold">R$ 2.000,00</p>
              )}
              <p className="text-xs opacity-80 mt-1">ou parcele em até 12x com juros</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-3/5 p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Complete sua inscrição</h1>
            <p className="text-gray-600 mb-6">Preencha os dados abaixo para garantir sua vaga</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={handleChange}
                    maxLength={18}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Celular/Telefone
                  </label>
                  <input
                    type="text"
                    name="numeroContato"
                    value={formData.numeroContato}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleCepChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logradouro
                  </label>
                  <input
                    type="text"
                    name="logradouro"
                    value={formData.logradouro}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numero da casa
                  </label>
                  <input
                    type="text"
                    name="numeroCasa"
                    value={formData.numeroCasa}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profissão
                  </label>
                  <input
                    type="text"
                    name="profissao"
                    value={formData.profissao}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Como irá participar do curso
                  </label>
                  <select
                    name="modalidadeDeAula"
                    value={formData.modalidadeDeAula}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option></option>
                    {modalidadeDeAulas.map((aula) => (
                      <option key={aula.value} value={aula.value}>
                        {aula.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Curso
                </label>
                <select
                  name="curso"
                  value={formData.curso}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option></option>
                  {cursos.map((curso) => (
                    <option key={curso.value} value={curso.value}>
                      {curso.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Valor Total:</span>
                  {isCursoMentoria ? (
                    <span className="text-xl font-bold text-green-600">R$ 500.00</span>
                  ) : (
                    <span className="text-xl font-bold text-green-600">R$ 2.000,00</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 text-right">Pagamento único ou parcele no cartão</p>
              </div>

              {isCursoMentoria ? (

                <div>
                  <button
                    type="submit"
                    // onClick={() => setModalAssinaturaMentoriaAberta(true)} 
                    className="w-full py-3 px-4 bg-yellow-500 hover:from-green-700 hover:to-yello-950 text-blue font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Finalizar Inscrição
                  </button>
                  <ModalAssinaturaMentoria isOpen={modalAssinaturaMentoriaAberta} onClose={() => setModalAssinaturaMentoriaAberta(false)} />
                </div>

              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 bg-yellow-500 hover:from-green-700 hover:to-yello-950 text-blue font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed flex justify-center items-center' :
                      ''}`}
                >
                  {isSubmitting ? (
                    <>
                      Processando...
                    </>
                  ) : (
                    'Finalizar Inscrição'
                  )}
                </button>
              )}

            </form>
          </div>
        </div>
      </div>
    </main>
  );
}