import { NextResponse } from "next/server";
import { updateUsuario } from "@/utils/queries";
import { conn } from "@/utils/dbConnection";
import bcrypt from "bcrypt";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const data = await request.json();

  //const saltRounds = await bcrypt.genSalt(10);
  //data.password = await bcrypt.hash(data.password, saltRounds);

  const result = await conn.query(updateUsuario(id, data));
  const updatedUser = result.rows[0];
  //    const { password, ...newUser } = fullNewUser;

  return NextResponse.json(updatedUser, { status: 201 });
}
