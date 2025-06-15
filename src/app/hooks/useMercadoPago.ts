import { useEffect, useState } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";

interface SubscriptionData {
  userEmail: string;
  nameClient: string;
  cpfClient: string;
  idClient: string;
  cardTokenId: string;
  planId: string;
  transactionAmount?: number;
  frequency?: number;
  frequencyType?: string;
}

interface PlanData {
  reason?: string;
  transactionAmount: number;
  frequency?: number;
  frequencyType?: string;
  repetitions?: number;
  billingDay?: string;
  currencyId?: string;
}

const useMercadoPago = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
  }, []);

  async function createMercadoPagoCheckout(checkoutData: any) {
    try {
      const response = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      router.push(data.initPoint);
    } catch (error) {      
      throw new Error(`Erro ao criar checkout`);
    }
  }

  async function createPlan(planData: PlanData): Promise<string> {
    setLoading(true);
    setError(null);

    try {     

      const response = await fetch("/api/mercado-pago/create-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao criar plano: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();      

      if (!data.planId) {
        throw new Error("ID do plano não foi retornado");
      }

      return data.planId;

    } catch (error) {      
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao criar plano";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function createPlanAndSubscription(planData: PlanData, subscriptionData: Omit<SubscriptionData, 'planId'>) {
    try {
      setLoading(true);
      setError(null);

      // Etapa 1: Criar plano      
      const planId = await createPlan(planData);
      // Etapa 2: Criar assinatura com o plano      
      await createMercadoPagoSubscription({
        ...subscriptionData,
        planId,
        transactionAmount: planData.transactionAmount,
        frequency: planData.frequency,
        frequencyType: planData.frequencyType
      });

    } catch (error) {      
      throw error;
    }
  }

  async function createMercadoPagoSubscription(subscriptionData: SubscriptionData) {
    setLoading(true);
    setError(null);

    try {

      const response = await fetch("/api/mercado-pago/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao criar assinatura: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();      

      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        throw new Error("initPoint não encontrado na resposta");
      }

    } catch (error) {
      
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao criar assinatura";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    createMercadoPagoCheckout,
    createPlan,
    createMercadoPagoSubscription,
    createPlanAndSubscription,
    loading,
    error
  };
};

export default useMercadoPago;
