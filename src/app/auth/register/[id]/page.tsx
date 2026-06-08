"use client";

import { Container, Text, Flex } from "@radix-ui/themes";
import SignUpForm from "@/components/auth/SignUpForm";
import NavLink from "next/link";
import { User } from "@/interfaces/auth";
import { useEffect, useState, use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

function RegisterPage({ params }: Props) {
  const { id } = use(params);
  const [usuario, setUsuario] = useState<User | null>(null);

  if (!id) {
    return <div> Identificador de usuario inválido </div>;
  }

  async function getUsuario(id: string) {
    const res = await fetch(`/api/auth/usuario/${id}`);
    if (!res.ok) return null;
    const resp = await res.json();
    if (resp.error || !resp.data) return null;
    const userDataPre = resp?.data ? resp.data[0] : null;
    const userData: User = {
      id: userDataPre.id,
      userName: userDataPre.username,
      email: userDataPre.email,
      password: userDataPre.password,
      comentario: userDataPre.comentario,
      activo: userDataPre.fechafin ? false : true,
    };
    setUsuario(userData);
  }

  useEffect(() => {
    getUsuario(id);
  }, []);

  if (!usuario) {
    return <div>No se encontró el usuario</div>;
  }

  return (
    <>
      <div className="flex h-screen w-full justify-center items-center m-2">
        <Flex
          direction="column"
          gap="2"
          className="w-full md:w-1/3 items-center"
        >
          <SignUpForm userData={usuario} />
          <Container size="1" className="w-full text-center p-2 text-sm">
            <Text>Ya tiene una cuenta? </Text>
            <NavLink href="/auth/login" className="text-blue-600 underline">
              Inicie sesión
            </NavLink>
          </Container>
        </Flex>
      </div>
    </>
  );
}

export default RegisterPage;
