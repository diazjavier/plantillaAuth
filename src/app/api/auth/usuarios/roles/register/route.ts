import { NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { creaUsuarioRol } from "@/utils/queries";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await conn.query(creaUsuarioRol(data));
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error en API activate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
