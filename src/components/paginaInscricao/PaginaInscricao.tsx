"use client";
import { ToastNotificacao } from "../toastNotificacao/ToastNotificacao";
import { SegurancaMercadoPago } from "../segurancaMercadoPago/SegurancaMercadoPago";
import { InformacoesCurso } from "../informacoesCurso/InformacoesCurso";
import { FormularioInscricao } from "../formularioInscricao/FormularioInscricao";
import React, { useState, useContext, useEffect } from 'react';
import useMercadoPago from "@/src/app/hooks/useMercadoPago";
import axios from 'axios';
import { UserContext } from "../providers/Providers";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PaginaInscricao({
    fg,
    isCursoMentoria: initialIsCursoMentoria = false,
    modalAssinaturaMentoriaAberta: initialModalAssinaturaMentoriaAberta = false
}: {
    fg: any;
    isCursoMentoria?: boolean;
    modalAssinaturaMentoriaAberta?: boolean;
}) {
    const router = useRouter();
    const { user, loading } = useContext(UserContext);
    const { createMercadoPagoCheckout } = useMercadoPago();    

    const [formData, setFormData] = useState({
        id: uuidv4(),
        nome: '',
        email: user?.email || '',
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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalAssinaturaMentoriaAberta, setModalAssinaturaMentoriaAberta] = useState(initialModalAssinaturaMentoriaAberta);
    const [isCursoMentoria, setIsCursoMentoria] = useState(initialIsCursoMentoria);

    const modalidadeDeAulas = [
        { value: 'Presencial', label: 'Presencial' },
        { value: 'Online', label: 'Online' }
    ];

    const cursos = [
        { value: 'cursoCadi', label: 'Curso CADI - Carreira do Investidor (R$ 2.000,00)' },
        { value: 'mentoria', label: 'Mentoria (R$ 500.00)' }
    ];


    useEffect(() => {
        setIsCursoMentoria(formData.curso === "mentoria");
    }, [formData.curso]);    

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

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        }

        setFormData(prev => ({
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
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
                
                setModalAssinaturaMentoriaAberta(true);
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
            <ToastNotificacao />
            <SegurancaMercadoPago />
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex">
                    <InformacoesCurso fg={fg} isCursoMentoria={isCursoMentoria} />
                    <FormularioInscricao                        
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        handlePhoneChange={handlePhoneChange}
                        handleCepChange={handleCepChange}
                        isSubmitting={isSubmitting}
                        isCursoMentoria={isCursoMentoria}
                        modalidadeDeAulas={modalidadeDeAulas}
                        cursos={cursos}
                        modalAssinaturaMentoriaAberta={modalAssinaturaMentoriaAberta}
                        setModalAssinaturaMentoriaAberta={setModalAssinaturaMentoriaAberta}
                    />
                </div>
            </div>
        </main>
    );
}