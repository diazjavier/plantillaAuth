import { NextResponse } from "next/server";
import { creaRol } from "@/utils/queries";
import { conn } from "@/utils/dbConnection";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const query = creaRol(data);
    const result = await conn.query(query);
    const newRol = result.rows[0];
    return NextResponse.json(newRol, { status: 201 });
  } catch (error) {
    console.error("Error en API activate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
