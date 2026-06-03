"use client";

import GenericTable from "@/components/GenericTable";
import GenericTable2 from "@/components/GenericTable2";
import {
  ColumnConfig,
  GenericButton,
  GenericTableProps2,
} from "@/interfaces/generics";
import {
  Pencil1Icon,
  TrashIcon,
  PlusIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { ComponentType, use } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  //sueldo: number;
  fecharegistro: string;
  activo?: boolean; // Para ícono de estado activo/inactivo
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuariosData = await listaUsuarios();
      setUsuarios(usuariosData);
    };
    fetchUsuarios();
  }, []);


  const listaUsuarios = async () => {
    try {
      const res = await fetch("/api/auth/usuarios");
      const data = await res.json();
      const usuarios: Usuario[] = data.data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        email: item.email,
        rol: item.rol,
        fecharegistro: item.fecharegistro,
        activo: item.activo, // Asegúrate de que el backend envíe este campo como booleano
      }));
      return usuarios;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return [];
    }
  };

  //   const listaUsuarios: Usuario[] = [
  //     {
  //       id: "1",
  //       nombre: "Carlos Gómez",
  //       email: "carlos@mail.com",
  //       rol: "Admin",
  //       //sueldo: 50000,
  //       fechaRegistro: "2026-05-29 00:48:27.411",
  //       activo: true,
  //     },
  //     {
  //       id: "2",
  //       nombre: "Ana Martínez",
  //       email: "ana@mail.com",
  //       rol: "Editor",
  //       //sueldo: 40000,
  //       fechaRegistro: "2026-06-03 13:19:42.133",
  //       activo: false,
  //     },
  //     {
  //       id: "3",
  //       nombre: "Luis Soler",
  //       email: "luis@mail.com",
  //       rol: "User",
  //       //sueldo: 30000,
  //       fechaRegistro: "2023-03-10",
  //       activo: false,
  //     },
  //     {
  //       id: "4",
  //       nombre: "Carlos Gómez",
  //       email: "carlos@mail.com",
  //       rol: "Admin",
  //       //sueldo: 50000,
  //       fechaRegistro: "2023-01-15",
  //       activo: true,
  //     },
  //     {
  //       id: "5",
  //       nombre: "Ana Martínez",
  //       email: "ana@mail.com",
  //       rol: "Editor",
  //       //sueldo: 40000,
  //       fechaRegistro: "2023-02-20",
  //       activo: true,
  //     },
  //     {
  //       id: "6",
  //       nombre: "Luis Soler",
  //       email: "luis@mail.com",
  //       rol: "User",
  //       //sueldo: 30000,
  //       fechaRegistro: "2023-03-10",
  //       activo: false,
  //     },
  //     {
  //       id: "7",
  //       nombre: "Carlos Gómez",
  //       email: "carlos@mail.com",
  //       rol: "Admin",
  //       //sueldo: 50000,
  //       fechaRegistro: "2023-01-15",
  //       activo: true,
  //     },
  //     {
  //       id: "8",
  //       nombre: "Ana Martínez",
  //       email: "ana@mail.com",
  //       rol: "Editor",
  //       //sueldo: 40000,
  //       fechaRegistro: "2023-02-20",
  //       activo: true,
  //     },
  //     {
  //       id: "12",
  //       nombre: "Luis Soler",
  //       email: "luis@mail.com",
  //       rol: "User",
  //       //sueldo: 30000,
  //       fechaRegistro: "2023-03-10",
  //       activo: false,
  //     },
  //     {
  //       id: "13",
  //       nombre: "Carlos Gómez",
  //       email: "carlos@mail.com",
  //       rol: "Admin",
  //       //sueldo: 50000,
  //       fechaRegistro: "2023-01-15",
  //       activo: true,
  //     },
  //     {
  //       id: "15",
  //       nombre: "Ana Martínez",
  //       email: "ana@mail.com",
  //       rol: "Editor",
  //       //sueldo: 40000,
  //       fechaRegistro: "2026-06-03 13:19:42.133",
  //       activo: true,
  //     },
  //     {
  //       id: "16",
  //       nombre: "Luis Soler",
  //       email: "luis@mail.com",
  //       rol: "User",
  //       //sueldo: 30000,
  //       fechaRegistro: "2023-03-10",
  //       activo: false,
  //     },
  //   ];

  // Configuración de comportamiento de las columnas enviada por prop
  const configColumnas: ColumnConfig<Usuario>[] = [
    {
      accessorKey: "id",
      header: "ID",
      dataType: "number", // Para formateo específico de números
      tooltip: "Identificador único del usuario",
      visible: false,
    },
    {
      accessorKey: "nombre",
      header: "Nombre Completo",
      //linkPrefix: "/usuarios/", // Hace que el nombre sea un Link a /usuarios/[id]
      //linkIdKey: "id",
      tooltip: "Nombre oficial del usuario registrado",
      visible: true,
    },
    {
      accessorKey: "email",
      dataType: "email", // Para formateo específico de emails (puede agregar un ícono o validación visual)
      header: "Correo Electrónico",      
    },
    {
      accessorKey: "rol",
      header: "Rol de Sistema",
      visible: true, // Puedes cambiarlo a false y Tanstack la removerá del renderizado
    },
    // {
    //   accessorKey: "sueldo",
    //   header: "Sueldo Mensual",
    //   dataType: "money", // Formateo específico para dinero
    // },
    {
      accessorKey: "fecharegistro",
      header: "Fecha de Inicio",
      dataType: "date", // Formateo específico para fechas
    },
    {
      accessorKey: "activo",
      header: "Activo",
      //   dataType: 'state', // Para renderizar como un ícono de estado
      //   booleanBadge: {
      //     trueLabel: "Activo",
      //     falseLabel: "Inactivo",
      //     trueColor: "activo",
      //     falseColor: "inactivo",
      //     trueTooltip: "Usuario activo",
      //     falseTooltip: "Usuario inactivo",
      //   },
      dataType: "boolean", // Se renderizará como un ícono (puedes personalizarlo en el componente)
      booleanDisplay: {
        trueIcon: CheckCircledIcon,
        falseIcon: CrossCircledIcon,
        trueColor: "text-green-500",
        falseColor: "text-red-500",
        trueTooltip: "Usuario activo",
        falseTooltip: "Usuario inactivo",
      },
    },
    {
      accessorKey: "editar",
      header: "Editar",
      dataType: "icon", // Para renderizar como ícono
      sortable: false, // Bloquea el ordenamiento en esta columna
      icon: Pencil1Icon,
      //action: (usuario) => alert(`Editando a: ${usuario.id}`),
      linkPrefix: "/auth/users2/", // Hace que el nombre sea un Link a /usuarios/[id]
      linkIdKey: "id",
    },
    {
      accessorKey: "eliminar",
      header: "Eliminar",
      dataType: "icon", // Para renderizar como ícono
      sortable: false, // Bloquea el ordenamiento en esta columna
      icon: TrashIcon,
      action: (usuario) => alert(`Eliminando a: ${usuario.id}`),
    },
  ];

  const botonNuevo: GenericButton = {
    label: "Nuevo Usuario",
    onClick: () => router.push("/auth/register"),
    icon: PlusIcon,
    tooltip: "Pulse para agregar un nuevo usuario",
    color: "blue",
  };

  const dataTableProps: GenericTableProps2<Usuario> = {
    title: "Gestión de Usuarios",
    data: usuarios,
    columnsConfig: configColumnas,
    newBoton: botonNuevo,
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <GenericTable2 {...dataTableProps} />
    </div>
  );
}
