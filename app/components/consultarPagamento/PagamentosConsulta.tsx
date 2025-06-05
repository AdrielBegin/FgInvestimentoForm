// app/components/PagamentosConsulta.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSpinner } from "react-icons/fa";
import {FiDownload} from "react-icons/fi";
import * as XLSX from "xlsx";

interface Pagamento {
    id: string;
    date_created: string;
    date_approved?: string;
    status: string;
    payment_method_id: string;
    payment_type_id: string;
    external_reference?: string;
    transaction_amount: number;
    payer: {
        email: string;
        first_name?: string;
        last_name?: string;
        identification: {
            type?: "CPF",
            number?: string
          },
    };
}

interface ConsultaParams {
    offset: number;
    limit: number;
    begin_date: string;
    end_date: string;
    sort: "date_approved" | "date_created" | "date_last_updated" | "money_release_date";
    criteria: "asc" | "desc";
}


export default function PagamentosConsulta() {
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [totalPagamentos, setTotalPagamentos] = useState<number>(0);

    const [params, setParams] = useState<ConsultaParams>({
        offset: 0,
        limit: 30,
        begin_date: "NOW-30DAYS",
        end_date: "NOW",
        sort: "date_created",
        criteria: "desc",
    });


    const [dataInicio, setDataInicio] = useState<string>("");
    const [dataFim, setDataFim] = useState<string>("");

    useEffect(() => {
        buscarPagamentos();
    }, [params.offset, params.limit]);

    const buscarPagamentos = async () => {
        setCarregando(true);
        setErro(null);

        try {
            const queryParams = new URLSearchParams({
                offset: params.offset.toString(),
                limit: params.limit.toString(),
                begin_date: params.begin_date,
                end_date: params.end_date,
                sort: params.sort,
                criteria: params.criteria,
            });

            const response = await axios.get(`/api/mercado-pago/payments?${queryParams}`);

            setPagamentos(response.data.results || []);
            setTotalPagamentos(response.data.paging?.total || 0);
        } catch (error) {
            console.error("Erro ao buscar pagamentos:", error);
            setErro("Erro ao buscar pagamentos. Tente novamente mais tarde.");
        } finally {
            setCarregando(false);
        }
    };
    const aplicarFiltros = () => {        
        let beginDate = params.begin_date;
        let endDate = params.end_date;

        if (dataInicio) {
            beginDate = dataInicio + "T00:00:00.000-03:00";
        }

        if (dataFim) {
            endDate = dataFim + "T23:59:59.999-03:00";
        }

        setParams({
            ...params,
            offset: 0, // Reinicia paginação
            begin_date: beginDate,
            end_date: endDate,
        });

        buscarPagamentos();
    };

    const proximaPagina = () => {
        if (params.offset + params.limit < totalPagamentos) {
            setParams({
                ...params,
                offset: params.offset + params.limit,
            });
        }
    };

    const paginaAnterior = () => {
        if (params.offset - params.limit >= 0) {
            setParams({
                ...params,
                offset: params.offset - params.limit,
            });
        }
    };
    const exportarXLSX = () => {
        if (pagamentos.length === 0) return;

        const dataToExport = pagamentos.map((pagamento) => ({
            "ID": pagamento.id,
            "Data de Criação": new Date(pagamento.date_created).toLocaleString("pt-BR"),
            "Data de Aprovação": pagamento.date_approved ? new Date(pagamento.date_approved).toLocaleString("pt-BR") : "-",
            "Status Pagamento": traduzirStatus(pagamento.status),
            "Método": traduzirMetodo(pagamento.payment_method_id),
            "Valor": pagamento.transaction_amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            "Payer Email": pagamento.payer.email,
            "Referência": pagamento.external_reference || "-",
        }));

        // Criando a planilha
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pagamentos");

        // Exportando o arquivo .xlsx
        XLSX.writeFile(workbook, `pagamentos_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };
   
    const traduzirStatus = (status: string): string => {
        const statusMap: Record<string, string> = {
            approved: "Aprovado",
            pending: "Pendente",
            in_process: "Em processamento",
            rejected: "Rejeitado",
            refunded: "Reembolsado",
            cancelled: "Cancelado",
            in_mediation: "Em disputa",
        };

        return statusMap[status] || status;
    };

    const traduzirMetodo = (metodo: string): string => {
        const metodosMap: Record<string, string> = {
            pix: "Pix",
            credit_card: "Cartão de Crédito",
            debit_card: "Cartão de Débito",
            bolbradesco: "Boleto",
            account_money: "Dinheiro em Conta",
        };

        return metodosMap[metodo] || metodo;
    };

    const getStatusClass = (status: string): string => {
        const statusClassMap: Record<string, string> = {
            approved: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            in_process: "bg-blue-100 text-blue-800",
            rejected: "bg-red-100 text-red-800",
            cancelled: "bg-gray-100 text-gray-800",
            refunded: "bg-purple-100 text-purple-800",
            in_mediation: "bg-orange-100 text-orange-800",
        };

        return statusClassMap[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Consulta de Pagamentos</h1>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data Início
                        </label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data Fim
                        </label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={aplicarFiltros}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={carregando}
                        >
                            {carregando ? (
                                <FaSpinner className="animate-spin mr-2" />
                            ) : (
                                <FaSearch className="mr-2" />
                            )}
                            Buscar
                        </button>

                        <button
                            onClick={exportarXLSX}
                            className="flex items-center justify-center ml-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
                            disabled={pagamentos.length === 0 || carregando}
                        >
                            <FiDownload className="mr-2" />
                            Exportar Excel
                        </button>
                    </div>
                </div>
            </div>

            {erro && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {erro}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {carregando ? (
                    <div className="flex justify-center items-center py-20">
                        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
                    </div>
                ) : pagamentos.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        Nenhum pagamento encontrado
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status Pagamento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Método
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            e-mail
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nome
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Referência
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            CPF
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pagamentos.map((pagamento) => (
                                        <tr key={pagamento.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {pagamento.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(pagamento.date_created).toLocaleString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(pagamento.status)}`}>
                                                    {traduzirStatus(pagamento.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {traduzirMetodo(pagamento.payment_type_id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {pagamento.transaction_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {pagamento.payer?.email ?? 'Não encontrado'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {pagamento.payer.first_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {pagamento.external_reference || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {pagamento.payer.identification.number || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                            <div className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{params.offset + 1}</span> a{" "}
                                <span className="font-medium">
                                    {Math.min(params.offset + params.limit, totalPagamentos)}
                                </span>{" "}
                                de <span className="font-medium">{totalPagamentos}</span> resultados
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={paginaAnterior}
                                    disabled={params.offset === 0}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium ${params.offset === 0
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={proximaPagina}
                                    disabled={params.offset + params.limit >= totalPagamentos}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium ${params.offset + params.limit >= totalPagamentos
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}