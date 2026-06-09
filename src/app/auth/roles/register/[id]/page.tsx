"use client";

import { Container, Text, Flex } from "@radix-ui/themes";
import RolesForm from "@/components/auth/RolesForm";
import { RolProps } from "@/interfaces/generics";
import { useEffect, useState, use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

function RegisterPage({ params }: Props) {
  const { id } = use(params);
  const [rol, setRol] = useState<RolProps | null>(null);

  if (!id) {
    return <div> Identificador de rol inválido </div>;
  }

  async function getRol(id: string) {
    const res = await fetch(`/api/auth/roles/${id}`);
    if (!res.ok) return null;
    const resp = await res.json();
    if (resp.error || !resp.data) return null;
    const rolDataPre = resp?.data ? resp.data[0] : null;
    const rolData: RolProps = {
      id: rolDataPre.id,
      rol: rolDataPre.rol,
      comentario: rolDataPre.comentario,
      activo: rolDataPre.fechafin ? false : true,
    };
    setRol(rolData);
  }

  useEffect(() => {
    getRol(id);
  }, []);

  if (!rol) {
    return <div>No se encontró el Rol</div>;
  }

  return (
    <>
      <div className="flex h-screen w-full justify-center items-center m-2">
        <Flex
          direction="column"
          gap="2"
          className="w-full md:w-1/3 items-center"
        >
          <RolesForm rolData={rol} />
        </Flex>
      </div>
    </>
  );
}

export default RegisterPage;
