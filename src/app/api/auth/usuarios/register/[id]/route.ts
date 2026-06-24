import { NextResponse } from "next/server";
import { updateUsuario } from "@/utils/queries";
import { conn } from "@/utils/dbConnection";
import bcrypt from "bcrypt";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const result = await conn.query(updateUsuario(id, data));
    const updatedUser = result.rows[0];
    return NextResponse.json(updatedUser, { status: 201 });
  } catch (error) {
    console.error("Error en API activate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
