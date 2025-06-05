// app/api/pagamentos/route.ts
import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "@/src/app/lib/mercado-pago";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parâmetros de paginação
        // Parâmetros de paginação
        const offset = parseInt(searchParams.get("offset") || "0");
        const limit = parseInt(searchParams.get("limit") || "30");

        // Parâmetros de filtro
        const sortParam = searchParams.get("sort") || "date_created";
        const criteriaParam = searchParams.get("criteria") || "desc";
        const beginDate = searchParams.get("begin_date") || "NOW-30DAYS";
        const endDate = searchParams.get("end_date") || "NOW";

        // Validação de sort para garantir que seja um dos valores permitidos
        const sort = (["date_approved", "date_created", "date_last_updated", "money_release_date"]
            .includes(sortParam) ? sortParam : "date_created") as "date_created" | "date_approved" | "date_last_updated" | "money_release_date";

        const criteria = (criteriaParam === "asc" ? "asc" : "desc") as "asc" | "desc";

        const payment = new Payment(mpClient);

        const searchResult = await payment.search({
            options: {
                sort: sort,
                criteria: criteria,
                range: "date_created",
                begin_date: beginDate,
                end_date: endDate,
                offset: offset,
                limit: limit,
            }
        });


        return NextResponse.json(searchResult);
    } catch (error) {
        console.error("Erro ao buscar pagamentos:", error);
        return NextResponse.json(
            { error: "Erro ao buscar pagamentos", details: error },
            { status: 500 }
        );
    }
}