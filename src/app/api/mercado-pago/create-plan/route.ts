// api/mercado-pago/create-plan/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {
            reason,
            transactionAmount,
            frequency,
            frequencyType,
            repetitions,
            billingDay,
            currencyId = "BRL"
        } = await req.json();

        const planPayload = {
            reason: reason || "Mentoria",
            auto_recurring: {
                frequency: frequency || 1,
                frequency_type: frequencyType || "months",
                repetitions: repetitions || 12,
                billing_day: parseInt(billingDay) || 5,
                billing_day_proportional: true,
                free_trial: {
                    frequency: 1,
                    frequency_type: "months"
                },
                transaction_amount: transactionAmount || 50,
                currency_id: currencyId
            },
            payment_methods_allowed: {
                payment_types: [
                    {
                        id: "credit_card"
                    },
                    {
                        id: "pix"
                    }
                ],
                payment_methods: [
                    {
                        id: "visa"
                    },
                    {
                        id: "master"
                    },
                    {
                        id: "elo"
                    }
                ]
            },
            back_url: "https://fg-investimento-form.vercel.app/"
        };       

        const response = await fetch("https://api.mercadopago.com/preapproval_plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(planPayload),
        });

        const data = await response.json();

        if (!response.ok) {            
            return NextResponse.json(
                {
                    error: "Erro ao criar plano",
                    details: data
                },
                { status: response.status }
            );
        }

        if (!data.id) {            
            throw new Error("Falha ao criar plano - ID não retornado");
        }

        return NextResponse.json({
            planId: data.id,
            status: data.status,
            init_point: data.init_point,
            data: data
        });

    } catch (error) {        
        return NextResponse.json(
            {
                error: "Erro interno do servidor",
                message: error instanceof Error ? error.message : "Erro desconhecido"
            },
            { status: 500 }
        );
    }
}