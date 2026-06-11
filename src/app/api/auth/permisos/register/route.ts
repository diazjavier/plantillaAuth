import { NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { creaPermiso } from "@/utils/queries";

export async function POST(request: Request) {

    const data = await request.json();
    const query = creaPermiso(data);
    const result = await conn.query(query);
    const newRow = result.rows[0];

    return NextResponse.json(newRow, { status: 201 });
};