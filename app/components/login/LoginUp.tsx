'use client';
import { use, useState } from 'react';
import {
  loginWithEmailAndPassword,
  signWithGoogle,
  getUserRole
} from '@/app/config/authentication';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import fg from '@/app/logo/LogoFG.svg';
import Image from 'next/image';
import Link from "next/link";
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from "@/app/config/firebaseClient";
import useMercadoPago from "@/app/hooks/useMercadoPago";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { createMercadoPagoCheckout } = useMercadoPago();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      
      const alunosRef = collection(db, 'alunos');
      const q = query(alunosRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const formData = {
          userId: querySnapshot.docs[0].data().uid,
          email: email,
          nome: querySnapshot.docs[0].data().nome,
          curso: querySnapshot.docs[0].data().curso,
          valor: querySnapshot.docs[0].data().valor
        }

        await createMercadoPagoCheckout({
          userId: formData.userId || formData.email,
          userEmail: formData.email,
          name: formData.nome,
          productName: formData.curso,
          productPrice: formData.valor
        });

      } else {

        const user = await loginWithEmailAndPassword(email, password);
        const userRole = await getUserRole(user.uid);

        if (user) {
          if (userRole === "admin") {
            router.push('/telaAdmin');
          } else {
            router.push('/formularioMercadoPago');
          }
        }

      }
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signWithGoogle();
      router.push('/formularioMercadoPago');
    } catch (err) {
      setError('Falha no login com Google.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-blue-600 p-12 flex flex-col items-center justify-center text-white">
          <div className="mb-8">
            <Image
              src={fg}
              alt="Logo"
              width={200}
              height={200}
              className="filter brightness-0 invert"
            />
          </div>

          <h2 className="text-3xl font-bold mb-4 text-center">Bem-vindo!</h2>
          <p className="text-center opacity-90 mb-8">
            Acesse sua conta para continuar de onde parou.
          </p>

          <div className="w-full max-w-xs">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-500  flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm">Acesso rápido e seguro</span>
            </div>
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm">Seus dados protegidos</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Acesse sua conta</h1>
          <p className="text-gray-600 mb-8">Informe suas credenciais para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-end mt-1">
                {/* <a href="#" className="text-sm text-green-600 hover:text-green-500">
                  Esqueceu sua senha?
                </a> */}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-yellow-500 hover:from-green-700 hover:to-blue-700 text-blue font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Entrar
            </button>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou continue com</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-100 transition-all duration-300"
            >
              <FaGoogle className="mr-3 text-xl text-red-500" />
              Entrar com Google
            </button> */}

            <div className="mt-4 flex justify-center">
              <Link
                className="inline-block bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition-colors duration-200"
                href="/">
                Voltar para Tela Incial
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <a href="/signUp" className="font-medium text-blue-500 hover:text-blue-800">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}