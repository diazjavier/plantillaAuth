import { NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { getRolesPermisos } from "@/utils/queries";

export async function GET() {
  try {
    const query = getRolesPermisos();
    const response = await conn.query(query);
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
