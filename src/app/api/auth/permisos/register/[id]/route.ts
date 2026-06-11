import { NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { updatePermiso } from "@/utils/queries";


export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const data = await request.json();

  const query = updatePermiso(id, data);
  const result = await conn.query(query);
  const updatedRow = result.rows[0];
 
  return NextResponse.json(updatedRow, { status: 201 });
}
