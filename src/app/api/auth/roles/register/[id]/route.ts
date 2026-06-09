import { NextResponse } from "next/server";
import { updateRol } from "@/utils/queries";
import { conn } from "@/utils/dbConnection";


export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const data = await request.json();

  //const saltRounds = await bcrypt.genSalt(10);
  //data.password = await bcrypt.hash(data.password, saltRounds);

  const query = updateRol(id, data);
  console.log("Query: ", query);
  const result = await conn.query(query);
  const updatedRol = result.rows[0];
  //    const { password, ...newUser } = fullNewUser;

  return NextResponse.json(updatedRol, { status: 201 });
}
