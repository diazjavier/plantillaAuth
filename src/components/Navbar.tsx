"use client";

import {
  Heading,
  Link,
  Flex,
  Container,
  DropdownMenu,
  Button,
} from "@radix-ui/themes";

import { HamburgerMenuIcon, CaretDownIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-[#042a57] text-white">
      <Container size="4">
        <div className="flex h-16 items-center justify-between px-4">
          {/* LOGO */}
          <NextLink href="/" className="min-w-0">
            <img src="/pureti.svg" alt="Home" className="h-10 w-auto" />
          </NextLink>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            <Link asChild color="gray">
              <NextLink href="/">Home</NextLink>
            </Link>

            {!session && (
              <Link asChild color="gray">
                <NextLink href="/auth/login">Login</NextLink>
              </Link>
            )}

            {session && (
              <>
                <Link asChild color="gray">
                  <NextLink href="/pages/productos">Productos</NextLink>
                </Link>

                <Link asChild color="gray">
                  <NextLink href="/pages/clientes">Clientes</NextLink>
                </Link>

                <Link asChild color="gray">
                  <NextLink href="/pages/aplicaciones">Aplicaciones</NextLink>
                </Link>



                {/* NUEVO DESPLEGABLE DE USUARIOS */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                      Sistema
                      <CaretDownIcon />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="!bg-[#042a57] !text-white border border-slate-700 hover:text-gray-300">
                    <DropdownMenu.Item asChild>
                      <NextLink href="/auth/users2">Usuarios</NextLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NextLink href="/auth/roles">Roles</NextLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NextLink href="/auth/permisos">Permisos</NextLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NextLink href="/auth/usuariosroles">Asignación de roles</NextLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NextLink href="/auth/rolespermisos">Asignación de permisos</NextLink>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>




                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="solid" color="blue">
                      {session?.user?.name || "User"}
                      <DropdownMenu.TriggerIcon />
                    </Button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content>
                    <DropdownMenu.Item>Mi perfil</DropdownMenu.Item>

                    <DropdownMenu.Item>Condiciones de uso</DropdownMenu.Item>

                    <DropdownMenu.Separator />

                    <DropdownMenu.Item color="red" onClick={() => signOut()}>
                      Cerrar sesión
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </>
            )}
          </div>

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost" color="gray">
                  <HamburgerMenuIcon
                    width={20}
                    height={20}
                    className="text-white"
                  />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content align="end">
                <DropdownMenu.Item asChild>
                  <NextLink href="/">Home</NextLink>
                </DropdownMenu.Item>

                {!session && (
                  <DropdownMenu.Item asChild>
                    <NextLink href="/auth/login">Login</NextLink>
                  </DropdownMenu.Item>
                )}

                {session && (
                  <>
                    <DropdownMenu.Item asChild>
                      <NextLink href="/pages/productos">Productos</NextLink>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item asChild>
                      <NextLink href="/pages/clientes">Clientes</NextLink>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item asChild>
                      <NextLink href="/pages/aplicaciones">Aplicaciones</NextLink>
                    </DropdownMenu.Item>


                    {/* NUEVAS OPCIONES EN EL MENÚ MÓVIL */}
                    <DropdownMenu.Separator />
                    <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Sistema
                    </div>
                    <DropdownMenu.Item asChild>
                      <NextLink href="/auth/users2">Usuarios</NextLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NextLink href="/auth/roles">Roles</NextLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NextLink href="/auth/permisos">Permisos</NextLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NextLink href="/auth/usuariosroles">Asignación de roles</NextLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NextLink href="/auth/rolespermisos">Asignación de permisos</NextLink>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator />

                    <DropdownMenu.Item>Mi perfil</DropdownMenu.Item>

                    <DropdownMenu.Item>Condiciones de uso</DropdownMenu.Item>

                    <DropdownMenu.Separator />

                    <DropdownMenu.Item color="red" onClick={() => signOut()}>
                      Cerrar sesión
                    </DropdownMenu.Item>
                  </>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
