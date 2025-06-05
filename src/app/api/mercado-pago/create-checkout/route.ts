import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/src/app/lib/mercado-pago";


export async function POST(req: NextRequest) {
  const {
    userEmail,
    nameClient,
    cpfClient,
    idClient,
  } = await req.json();

  const externalReference = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  try {
    const preference = new Preference(mpClient);

    const createdPreference = await preference.create({
      body: {
        external_reference: externalReference, // IMPORTANTE: Isso aumenta a pontuação da sua integração com o Mercado Pago - É o id da compra no nosso sistema

        metadata: {
          // O Mercado Pago converte para snake_case, ou seja, testeId vai virar teste_id
          userEmail: userEmail,
          // plan: '123'
          //etc
        },
        ...(userEmail && {
          payer: {
            type:"customer",
            id: idClient,
            email: userEmail,
            name: nameClient,
            identification: {
              type: "CPF",
              number: cpfClient
            }
          },
        }),

        items: [
          {
            id: "1",
            description: "é uma carreira, onde a pessoa se torna um investidor no mercado de criptomoedas, tendo acesso a um método FG School com um material 100% apostilado, operações práticas em criptomoedas, margem de risco, teitura de gráfico, posicionamento de indicadores e como usar. tudo isso você faz parte do curso CADI onde você se torna e constrói sua carreira de investidor.",
            title: "Curso CADI - Carreira do Investidor",
            quantity: 1,
            unit_price: 2000,
            currency_id: "BRL",
            category_id: "education", // Recomendado inserir, mesmo que não tenha categoria - Aumenta a pontuação da sua integração com o Mercado Pago
          },
        ],
        payment_methods: {

          installments: 12,
          excluded_payment_types: [],
          excluded_payment_methods: [],
        },
        // auto_return: "approved",
        back_urls: {
          success: `${req.headers.get("origin")}/?status=sucesso`,
          failure: `${req.headers.get("origin")}/?status=falha`,
          pending: `${req.headers.get("origin")}/api/mercado-pago/pending`, // Criamos uma rota para lidar com pagamentos pendentes
        },
      },
    });

    if (!createdPreference.id) {
      throw new Error("No preferenceID");
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
