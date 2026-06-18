import { NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { getRolesActivosMini } from "@/utils/queries";

export async function GET() {

    const query = getRolesActivosMini();
    const response = await conn.query(query);
    if (response.rows.length === 0) {
        return NextResponse.json({ error: "No data available" }, { status: 401 });
    };
    const data = response.rows;

    return NextResponse.json({ data }, { status: 200 });

};