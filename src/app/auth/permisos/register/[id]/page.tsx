"use client";

import { Container, Text, Flex } from "@radix-ui/themes";
import PermisosForm from "@/components/auth/PermisosForm";
import { PermisoProps } from "@/interfaces/generics";
import { useEffect, useState, use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

function RegisterPage({ params }: Props) {
  const { id } = use(params);
  const [permiso, setPermiso] = useState<PermisoProps | null>(null);

  if (!id) {
    return <div> Identificador de permiso inválido </div>;
  }

  async function getPermiso(id: string) {
    const res = await fetch(`/api/auth/permisos/${id}`);
    if (!res.ok) return null;
    const resp = await res.json();
    if (resp.error || !resp.data) return null;
    const permisoDataPre = resp?.data ? resp.data[0] : null;
    const permisoData: PermisoProps = {
      id: permisoDataPre.id,
      permiso: permisoDataPre.permiso,
      comentario: permisoDataPre.comentario,
      activo: permisoDataPre.fechafin ? false : true,
    };
    setPermiso(permisoData);
  }

  useEffect(() => {
    getPermiso(id);
  }, []);

  if (!permiso) {
    return <div>No se encontró el Permiso</div>;
  }

  return (
    <>
      <div className="flex h-screen w-full justify-center items-center m-2">
        <Flex
          direction="column"
          gap="2"
          className="w-full md:w-1/3 items-center"
        >
          <PermisosForm permisoData={permiso} />
        </Flex>
      </div>
    </>
  );
}

export default RegisterPage;
