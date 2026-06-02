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
import { ComponentType } from "react";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  sueldo: number;
  fechaRegistro: string;
  activo?: boolean; // Para ícono de estado activo/inactivo
}

export default function UsuariosPage() {
  const listaUsuarios: Usuario[] = [
    {
      id: "1",
      nombre: "Carlos Gómez",
      email: "carlos@mail.com",
      rol: "Admin",
      sueldo: 50000,
      fechaRegistro: "2023-01-15",
      activo: true,
    },
    {
      id: "2",
      nombre: "Ana Martínez",
      email: "ana@mail.com",
      rol: "Editor",
      sueldo: 40000,
      fechaRegistro: "2023-02-20",
      activo: false,
    },
    {
      id: "3",
      nombre: "Luis Soler",
      email: "luis@mail.com",
      rol: "User",
      sueldo: 30000,
      fechaRegistro: "2023-03-10",
      activo: false,
    },
    {
      id: "4",
      nombre: "Carlos Gómez",
      email: "carlos@mail.com",
      rol: "Admin",
      sueldo: 50000,
      fechaRegistro: "2023-01-15",
      activo: true,
    },
    {
      id: "5",
      nombre: "Ana Martínez",
      email: "ana@mail.com",
      rol: "Editor",
      sueldo: 40000,
      fechaRegistro: "2023-02-20",
      activo: true,
    },
    {
      id: "6",
      nombre: "Luis Soler",
      email: "luis@mail.com",
      rol: "User",
      sueldo: 30000,
      fechaRegistro: "2023-03-10",
      activo: false,
    },
    {
      id: "7",
      nombre: "Carlos Gómez",
      email: "carlos@mail.com",
      rol: "Admin",
      sueldo: 50000,
      fechaRegistro: "2023-01-15",
      activo: true,
    },
    {
      id: "8",
      nombre: "Ana Martínez",
      email: "ana@mail.com",
      rol: "Editor",
      sueldo: 40000,
      fechaRegistro: "2023-02-20",
      activo: true,
    },
    {
      id: "12",
      nombre: "Luis Soler",
      email: "luis@mail.com",
      rol: "User",
      sueldo: 30000,
      fechaRegistro: "2023-03-10",
      activo: false,
    },
    {
      id: "13",
      nombre: "Carlos Gómez",
      email: "carlos@mail.com",
      rol: "Admin",
      sueldo: 50000,
      fechaRegistro: "2023-01-15",
      activo: true,
    },
    {
      id: "15",
      nombre: "Ana Martínez",
      email: "ana@mail.com",
      rol: "Editor",
      sueldo: 40000,
      fechaRegistro: "2₀₂₃-₀₂-₂₀",
      activo: true,
    },
    {
      id: "16",
      nombre: "Luis Soler",
      email: "luis@mail.com",
      rol: "User",
      sueldo: 30000,
      fechaRegistro: "2023-03-10",
      activo: false,
    },
  ];

  // Configuración de comportamiento de las columnas enviada por prop
  const configColumnas: ColumnConfig<Usuario>[] = [
    {
      accessorKey: "id",
      header: "ID",
      dataType: "number", // Para formateo específico de números
      tooltip: "Identificador único del usuario",
      visible: true,
    },
    {
      accessorKey: "nombre",
      header: "Nombre Completo",
      linkPrefix: "/usuarios/", // Hace que el nombre sea un Link a /usuarios/[id]
      linkIdKey: "id",
      tooltip: "Nombre oficial del usuario registrado",
      visible: true,
    },
    {
      accessorKey: "email",
      header: "Correo Electrónico",
      linkPrefix: "https://www.google.com",
    },
    {
      accessorKey: "rol",
      header: "Rol de Sistema",
      visible: true, // Puedes cambiarlo a false y Tanstack la removerá del renderizado
    },
    {
      accessorKey: "sueldo",
      header: "Sueldo Mensual",
      dataType: "money", // Formateo específico para dinero
    },
    {
      accessorKey: "fechaRegistro",
      header: "Fecha de Inicio",
      dataType: "date", // Formateo específico para fechas
    },
    {
      accessorKey: "activo",
      header: "Activo",
      dataType: 'state', // Para renderizar como un ícono de estado
      booleanBadge: {
        trueLabel: "Activo",
        falseLabel: "Inactivo",
        trueColor: "activo",
        falseColor: "inactivo",
        trueTooltip: "Usuario activo",
        falseTooltip: "Usuario inactivo",
      },
    //   dataType: "boolean", // Se renderizará como un ícono (puedes personalizarlo en el componente)
    //   booleanDisplay: {
    //     trueIcon: CheckCircledIcon,
    //     falseIcon: CrossCircledIcon,
    //     trueColor: "text-green-500",
    //     falseColor: "text-red-500",
    //     trueTooltip: "Usuario activo",
    //     falseTooltip: "Usuario inactivo",
    //   },
      // tooltip: "Indica si el usuario está activo o inactivo",
      // icon: CheckCircledIcon,
      //  textColor: "green",
      //   render: (value: any) =>
      //     value ? (
      //       <CheckCircledIcon className="w-5 h-5 text-green-500" />
      //     ) : (
      //       <CrossCircledIcon className="w-5 h-5 text-red-500" />
      //     )
    },
    {
      accessorKey: "editar",
      header: "Editar",
      dataType: "icon", // Para renderizar como ícono
      sortable: false, // Bloquea el ordenamiento en esta columna
      icon: Pencil1Icon,
      action: (usuario) => alert(`Editando a: ${usuario.id}`),
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
    onClick: () => alert("Añadiendo nuevo usuario"),
    icon: PlusIcon,
    tooltip: "Pulse para agregar un nuevo usuario",
    color: "blue",
  };

  const dataTableProps: GenericTableProps2<Usuario> = {
    title: "Gestión de Usuarios",
    data: listaUsuarios,
    columnsConfig: configColumnas,
    newBoton: botonNuevo,
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <GenericTable2 {...dataTableProps} />
    </div>
  );
}
