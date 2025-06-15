import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { initMercadoPago } from "@mercadopago/sdk-react";
import useMercadoPago from "@/src/app/hooks/useMercadoPago";
import { Dialog } from "@headlessui/react";

interface ModalAssinaturaProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalAssinaturaMentoria({ isOpen, onClose }: ModalAssinaturaProps) {
    const [sdkReady, setSdkReady] = useState(false);
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        cpf: "",
        valor: 500,
        billing_day: "5",
        repetitions: 12,
    });

    const hiddenTokenRef = useRef<HTMLInputElement>(null);
    const { createPlan } = useMercadoPago();

    useEffect(() => {
        const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "";
        if (publicKey) {
            initMercadoPago(publicKey);
            setSdkReady(true);
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!sdkReady || !window.MercadoPago) {
            console.error("MercadoPago SDK não está pronto.");
            return;
        }

        try {
            const planData = {
                reason: "Assinatura do Curso CADI",
                transactionAmount: formData.valor,
                frequency: 1,
                frequencyType: "months",
                repetitions: formData.repetitions,
                billingDay: formData.billing_day,
                currencyId: "BRL"
            };

            const checkoutUrl = await createPlan(planData);
            window.location.href = `https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=${checkoutUrl}`;
        } catch (error) {
            console.error("Erro ao processar pagamento:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "repetitions" || name === "valor" ? Number(value) : value
        }));
    };

    return (
        <>
            <Script src="https://sdk.mercadopago.com/js/v2" strategy="afterInteractive" />
            <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-6 z-10">
                        <Dialog.Title className="text-lg font-bold mb-4">Formulário de Assinatura</Dialog.Title>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Campos ocultos obrigatórios do MercadoPago */}
                            <select id="form-installments" className="hidden w-full p-2 border rounded">
                                <option value="">Parcelas</option>
                            </select>
                            <select id="form-issuer" className="w-full p-2 border rounded hidden">
                                <option value="">Banco emissor</option>
                            </select>

                            <label>Dia de cobrança:</label>
                            <select
                                name="billing_day"
                                value={formData.billing_day}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="5">5</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                            </select>

                            <label>Por quantos meses deseja pagar a mentoria?</label>
                            <input
                                type="number"
                                name="repetitions"
                                value={formData.repetitions}
                                onChange={handleChange}
                                min="1"
                                max="24"
                                className="w-full p-2 border rounded"
                            />

                            <input type="hidden" ref={hiddenTokenRef} id="MPHiddenInputToken" />

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Assinar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
