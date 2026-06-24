import { NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { inactivateRolPermiso } from "@/utils/queries";

// El primer parámetro DEBE ser 'request' (Request), el segundo es el contexto con los params
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const query = inactivateRolPermiso(id);
    console.log("Query: ", query);
    const response = await conn.query(query);
    
    if (response.rows.length === 0) {
      return NextResponse.json({ error: "No data available" }, { status: 404 }); // Cambiado a 404 Not Found
    }
    
    const data = response.rows;
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error en API inactivate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}