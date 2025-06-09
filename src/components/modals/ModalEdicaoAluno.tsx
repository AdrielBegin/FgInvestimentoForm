'use client';
import { useState, useEffect } from 'react';
import db from "@/src/app/config/firebaseClient";
import { doc, updateDoc, getDoc } from 'firebase/firestore';

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

type ModalEdicaoAlunoProps = {
    isOpen: boolean;
    onClose: () => void;
    alunoId: string;
    onUpdate: () => void;
};

export default function ModalEdicaoAluno({ isOpen, onClose, alunoId, onUpdate }: ModalEdicaoAlunoProps) {
    const [aluno, setAluno] = useState<Aluno | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');    

    useEffect(() => {
        if (isOpen && alunoId) {
            carregarAluno();
        }
    }, [isOpen, alunoId]);

    const carregarAluno = async () => {
        try {
            setLoading(true);
            setError('');

            const ref = doc(db, 'alunos', alunoId);
            const alunoDoc = await getDoc(ref);

            if (alunoDoc.exists()) {
                setAluno({ id: alunoDoc.id, ...alunoDoc.data() } as Aluno);
            } else {
                setError('Aluno não encontrado');
                console.error("Documento não encontrado para o ID:", alunoId);
            }
        } catch (err) {
            setError('Erro ao carregar aluno');
            console.error("Erro no Firestore:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!aluno) return;

        const { name, value } = e.target;
        setAluno({
            ...aluno,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aluno) return;

        try {
            setLoading(true);
            const alunoRef = doc(db, 'alunos', alunoId);
            await updateDoc(alunoRef, {
                nome: aluno.nome,
                email: aluno.email,
                cidade: aluno.cidade,
                cep: aluno.cep,
                estado: aluno.estado,
                logradouro: aluno.logradouro,
                numeroCasa: aluno.numeroCasa,
                profissao: aluno.profissao,
                cpfCnpj: aluno.cpfCnpj,
                status: aluno.status,
                modalidadeDeAula: aluno.modalidadeDeAula,
                numeroContato: aluno.numeroContato
            });

            onUpdate();
            onClose();
        } catch (err) {
            setError('Erro ao atualizar aluno');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Editar Aluno</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>

                    {loading && !aluno ? (
                        <div className="text-center py-8">Carregando...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8">{error}</div>
                    ) : aluno ? (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={aluno.nome}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={aluno.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
                                    <input
                                        type="text"
                                        name="cpfCnpj"
                                        value={aluno.cpfCnpj}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
                                    <input
                                        type="text"
                                        name="profissao"
                                        value={aluno.profissao}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                    <input
                                        type="text"
                                        name="cep"
                                        value={aluno.cep}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <input
                                        type="text"
                                        name="estado"
                                        value={aluno.estado}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                    <input
                                        type="text"
                                        name="cidade"
                                        value={aluno.cidade}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                                    <input
                                        type="text"
                                        name="logradouro"
                                        value={aluno.logradouro}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                    <input
                                        type="text"
                                        name="numeroCasa"
                                        value={aluno.numeroCasa}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
                                    <input
                                        type="text"
                                        name="numeroContato"
                                        value={aluno.numeroContato || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={aluno.status || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="ativo">Ativo</option>
                                        <option value="inativo">Inativo</option>
                                        <option value="pendente">Pendente</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Modalidade</label>
                                    <select
                                        name="modalidadeDeAula"
                                        value={aluno.modalidadeDeAula || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="presencial">Presencial</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                            </div>

                            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                >
                                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </form>
                    ) : null}
                </div>
            </div>
        </div>
    );
}