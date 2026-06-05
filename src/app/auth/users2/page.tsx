"use client";

import GenericTable from "@/components/GenericTable";
import GenericTable2 from "@/components/GenericTable2";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  ColumnConfig,
  GenericButton,
  GenericTableProps2,
  ConfirmDialogProps,
} from "@/interfaces/generics";
import {
  Pencil1Icon,
  TrashIcon,
  PlusIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  SymbolIcon,
} from "@radix-ui/react-icons";
import { ComponentType, use } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] =
    useState<ConfirmDialogProps>({
      //isOpen: false,
      onClose: () => {},
      title: "",
      description: "",
      confirmText: undefined,
      cancelText: undefined,
      confirmColor: undefined,
      onConfirm: () => {},
    });

  const confirmaActivaUsuario = (id: string) => {
    setConfirmDialogConfig({
      //isOpen: true,
      onClose: () => setConfirmDialogOpen(false),
      title: "Activación de Usuarios",
      description: "¿Está seguro de que desea activar a este usuario?",
      confirmText: "Activar",
      cancelText: "Cancelar",
      confirmColor: "green",
      onConfirm: async () => {
        try {
          await activaUsuario(id);
          toast.success(`Usuario activado con éxito`);
          setConfirmDialogOpen(false);
        } catch (error) {
          // Opcional: Toast de error por si falla la red
          toast.error("No se pudo procesar la solicitud");
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const confirmaInactivaUsuario = (id: string) => {
    setConfirmDialogConfig({
      //isOpen: true,
      onClose: () => setConfirmDialogOpen(false),
      title: "Inactivación de Usuarios",
      description: "¿Está seguro de que desea inactivar a este usuario?",
      confirmText: "Inactivar",
      cancelText: "Cancelar",
      confirmColor: "red",
      onConfirm: async () => {
        try {
          await inactivaUsuario(id);
          toast.success(`Usuario inactivado con éxito`);
          setConfirmDialogOpen(false);
        } catch (error) {
          toast.error("No se pudo procesar la solicitud");
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const activaUsuario = async (id: string) => {
    const response = await fetch(`/api/auth/usuario/activate/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (response.status !== 200) {
      // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
      console.log("Error al activar el usuario: ", res.error);
      return;
    }
    fetchUsuarios();
  };

  const inactivaUsuario = async (id: string) => {
    const response = await fetch(`/api/auth/usuario/inactivate/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (response.status !== 200) {
      // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
      console.log("Error al inactivar el usuario: ", res.error);
      return;
    }
    fetchUsuarios();
  };

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
        activo2: item.activo, // Para la columna de acción, puedes usar el mismo campo o uno diferente según tu lógica
      }));
      return usuarios;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return [];
    }
  };

  const fetchUsuarios = async () => {
    const usuariosData = await listaUsuarios();
    setUsuarios(usuariosData);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

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
      //   dataType: 'state', // Para renderizar como una píldora de estado
      //   booleanBadge: {
      //     trueLabel: "Activo",
      //     falseLabel: "Inactivo",
      //     trueColor: "activo",
      //     falseColor: "inactivo",
      //     trueTooltip: "Usuario activo",
      //     falseTooltip: "Usuario inactivo",
      //   },
      dataType: "boolean", // Se renderizará como un ícono (puedes personalizarlo en el componente)
      booleanIcon: {
        trueIcon: CheckCircledIcon,
        falseIcon: CrossCircledIcon,
        trueColor: "text-green-300",
        falseColor: "text-red-300",
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
      accessorKey: "activo2",
      header: "Acción",
      dataType: "boolean", // Para renderizar como ícono
      sortable: false, // Bloquea el ordenamiento en esta columna
      booleanIcon: {
        trueIcon: TrashIcon,
        falseIcon: SymbolIcon,
        trueColor: "text-red-400",
        falseColor: "text-blue-400",
        trueTooltip: "Inhabilitar usuario",
        falseTooltip: "Reactivar usuario",

        action: (usuario) => {
          usuario.activo
            ? confirmaInactivaUsuario(usuario.id.toString())
            : confirmaActivaUsuario(usuario.id.toString());
        },
      },
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
      <ConfirmDialog
        confirmdialog={confirmDialogConfig}
        open={confirmDialogOpen}
      />
    </div>
  );
}
