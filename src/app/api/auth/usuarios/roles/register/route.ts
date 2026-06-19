import { NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { creaUsuarioRol } from "@/utils/queries";

export async function POST(request: Request) {
    const data = await request.json();
    const result = await conn.query(creaUsuarioRol(data));
    return NextResponse.json(result, { status: 201 });
};