import { NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { getUsuariosDummy, getUsuariosRoles } from "@/utils/queries";

export async function GET() {
    // Traigo los Usuarios
    const query = getUsuariosDummy();
    const response = await conn.query(query);
    if (response.rows.length === 0) {
        return NextResponse.json({ error: "No data available" }, { status: 401 });
    };
    const dataUsuariosPre = response.rows;

    // Traigo todos los roles de los usuarios
    const query2 = getUsuariosRoles();
    const response2 = await conn.query(query2);
    const dataRolesPre = response2.rows;

    // Asigno los roles a cada usuario
    const data = dataUsuariosPre.map((user: any) => {
        const rolesUser: string[]  = [];
        dataRolesPre.map((rolraw: any) => {
            if(rolraw.idusuario === user.id){
                rolesUser.push(rolraw.rol);
            }
        });
        user.rol = rolesUser;
        return user;
    });

    return NextResponse.json({ data }, { status: 200 });
};