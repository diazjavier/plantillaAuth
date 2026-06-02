import { NextResponse } from "next/server";
import { creaUsuario } from "@/utils/queries";
import { conn } from "@/utils/dbConnection";
import bcrypt from "bcrypt";

export async function POST(request: Request) {

    const data = await request.json();

    const saltRounds = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, saltRounds);

    const result = await conn.query(creaUsuario(data));
    const fullNewUser = result.rows[0];
    const { password, ...newUser } = fullNewUser;

    return NextResponse.json(newUser, { status: 201 });
};