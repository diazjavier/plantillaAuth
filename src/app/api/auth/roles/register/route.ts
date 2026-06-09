import { NextResponse } from "next/server";
import { creaRol } from "@/utils/queries";
import { conn } from "@/utils/dbConnection";

export async function POST(request: Request) {

    const data = await request.json();
    const query = creaRol(data);
    console.log("Query: ", query);
    const result = await conn.query(query);
    const newRol = result.rows[0];

    return NextResponse.json(newRol, { status: 201 });
};