'use client';
import { useEffect, useState } from 'react';
import db from "@/src/app/config/firebaseClient";
import { doc, getDoc, updateDoc } from 'firebase/firestore';

type ModalExcluirAlunoProps = {
    isOpen: boolean;
    onClose: () => void;
    alunoId: string;
    alunoNome: string;
    onUpdate: () => void;
};

export default function ModalExcluirAluno({ isOpen, onClose, alunoId, alunoNome, onUpdate }: ModalExcluirAlunoProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [nomeAlunoBuscado, setNomeAlunoBuscado] = useState('');

    useEffect(() => {
        const buscarAluno = async () => {
            if (isOpen && alunoId) {
                try {
                    const alunoRef = doc(db, 'alunos', alunoId);
                    
                    const alunoSnap = await getDoc(alunoRef);

                    if (alunoSnap.exists()) {
                        const dados = alunoSnap.data();
                        setNomeAlunoBuscado(dados.nome || 'Desconhecido');
                    } else {
                        setNomeAlunoBuscado('Não encontrado');
                    }
                } catch (error) {                 
                    setNomeAlunoBuscado('Erro ao carregar');
                }
            }
        };

        buscarAluno();
    }, [isOpen, alunoId]);
    
    const handleExcluir = async () => {
        try {
            setLoading(true);
            setError('');

            const alunoRef = doc(db, 'alunos', alunoId);
            await updateDoc(alunoRef, {
                excluido: true,
                dataExclusao: new Date().toISOString()
            });

            onUpdate();
            onClose();
        } catch (err) {
            setError('Erro ao excluir aluno');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-5">
                        <h2 className="text-2xl font-semibold text-gray-800">Confirmar Exclusão</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label="Fechar modal"
                        >
                            <span className="text-2xl leading-none">&times;</span>
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-800 text-base">
                            Tem certeza que deseja excluir o aluno <span className="font-semibold">{nomeAlunoBuscado}</span>?
                        </p>
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed break-words">
                            Esta é uma exclusão lógica. O registro será mantido no sistema mas marcado como excluído.
                        </p>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mb-4 break-words">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleExcluir}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}