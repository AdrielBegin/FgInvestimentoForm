"use client";
import React, { useState } from 'react';
import useMercadoPago from "./hooks/useMercadoPago";
import Image from 'next/image';
import fg from '../app/logo/LogoFG.svg'
import axios from 'axios';


export default function Home() {
  const { createMercadoPagoCheckout } = useMercadoPago();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    curso: 'Curso CADI - Carreira do Investidor',
    valor: 2000,
    cpfCnpj: '',
    cep: '',
    estado: '',
    cidade: ''
  });

  const getCpfCnpjMask = (value: string): string => {
    const numeric = value.replace(/\D/g, '');

    if (numeric.length <= 11) {
      // Aplica máscara de CPF
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
    await saveToFirebase();

    createMercadoPagoCheckout({
      userId: formData.email,
      userEmail: formData.email,
      productName: formData.curso,
      productPrice: formData.valor
    });
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Image src={fg}
                alt="Logo da empresa"
                className="mx-auto mb-4"
                style={{ width: '50%', height: 'auto' }} />
              <h1 className="text-2xl font-bold text-center mb-6">Formulário de Inscrição</h1>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                    Curso
                  </label>
                  <select
                    name="curso"
                    value={formData.curso}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Curso CADI - Carreira do Investidor (R$ 2.000,00)</option>
                  </select>
                </div>

                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <p className="text-lg font-semibold">Valor Total: R$ 2.000,00</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Finalizar Inscrição
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}