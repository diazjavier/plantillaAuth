import { NextResponse, NextRequest } from "next/server";
import { conn } from "@/utils/dbConnection";
import { getUsuarioByName } from "@/utils/queries";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userName } = data;
    const query = getUsuarioByName(userName);
    const response = await conn.query(query);
    if (response.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }
    const user = response.rows[0];
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error en API activate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
