import { NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { getRolById } from "@/utils/queries";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const query = getRolById(id);
    const response = await conn.query(query);
    if (response.rows.length === 0) {
      return NextResponse.json({ error: "No data available" }, { status: 401 });
    }
    const data = response.rows;
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error en API activate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
