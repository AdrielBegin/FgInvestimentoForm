// api/mercado-pago/create-subscription/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {
            userEmail,
            nameClient,
            cpfClient,
            idClient,
            cardTokenId,
            planId, 
            transactionAmount = 50,
            frequency = 1,
            frequencyType = "months"
        } = await req.json();

        if (!cardTokenId) {            
            return NextResponse.json(
                { error: "Token do cartão é obrigatório" },
                { status: 400 }
            );
        }

        if (!planId) {
            
            return NextResponse.json(
                { error: "ID do plano é obrigatório" },
                { status: 400 }
            );
        }

        // if (!userEmail || !nameClient || !cpfClient) {
        //     console.error("Dados obrigatórios ausentes");
        //     return NextResponse.json(
        //         { error: "Dados do cliente são obrigatórios" },
        //         { status: 400 }
        //     );
        // }   

        const externalReference = `subscription-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);

        const subscriptionPayload = {
            preapproval_plan_id: planId, // Campo obrigatório para assinatura com plano
            reason: "Assinatura do Curso CADI",
            external_reference: externalReference,
            payer_email: userEmail,
            card_token_id: cardTokenId,
            auto_recurring: {
                frequency: frequency,
                frequency_type: frequencyType,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                transaction_amount: transactionAmount,
                currency_id: "BRL"
            },
            back_url: "https://fg-investimento-form.vercel.app/",
            status: "authorized" // Obrigatório para assinaturas com plano
        };       

        const response = await fetch("https://api.mercadopago.com/preapproval", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(subscriptionPayload),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { 
                    error: "Erro ao processar assinatura",
                    details: data 
                },
                { status: response.status }
            );
        }

        if (!data.id) {            
            throw new Error("Falha ao criar assinatura - ID não retornado");
        }

        window.location.href = data.init_point;
        return NextResponse.json({
            subscriptionId: data.id,
            initPoint: data.init_point,
            status: data.status,
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