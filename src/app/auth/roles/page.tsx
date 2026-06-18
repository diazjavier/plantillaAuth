"use client";

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

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Rol {
  id: string;
  rol: string;
  fecharegistro: string;
  activo?: boolean; // Para ícono de estado activo/inactivo
}

export default function RolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Rol[]>([]);
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

  const confirmaActivaRol = (id: string) => {
    setConfirmDialogConfig({
      //isOpen: true,
      onClose: () => setConfirmDialogOpen(false),
      title: "Activación de Roles",
      description: "¿Está seguro de que desea activar este Rol?",
      confirmText: "Activar",
      cancelText: "Cancelar",
      confirmColor: "green",
      onConfirm: async () => {
        try {
          await activaRol(id);
          setConfirmDialogOpen(false);
        } catch (error) {
          // Opcional: Toast de error por si falla la red
          toast.error("No se pudo procesar la solicitud");
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const confirmaInactivaRol = (id: string) => {
    setConfirmDialogConfig({
      //isOpen: true,
      onClose: () => setConfirmDialogOpen(false),
      title: "Inactivación de Roles",
      description: "¿Está seguro de que desea inactivar este Rol?",
      confirmText: "Inactivar",
      cancelText: "Cancelar",
      confirmColor: "red",
      onConfirm: async () => {
        try {
          await inactivaRol(id);
          setConfirmDialogOpen(false);
        } catch (error) {
          toast.error("No se pudo procesar la solicitud");
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const activaRol = async (id: string) => {
    const response = await fetch(`/api/auth/roles/activate/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (response.status !== 200) {
      // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
      console.log("Error al activar el Rol: ", res.error);
      return;
    }
    toast.success(`Rol activado con éxito`);
    fetchRoles();
  };

  const inactivaRol = async (id: string) => {
    const response = await fetch(`/api/auth/roles/inactivate/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (response.status !== 200) {
      // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
      console.log("Error al inactivar el Rol: ", res.error);
      return;
    }
    toast.success(`Rol inactivado con éxito`);
    fetchRoles();
  };

  const listaRoles = async () => {
    try {
      const res = await fetch("/api/auth/roles");
      const data = await res.json();
      const roles: Rol[] = data.data.map((item: any) => ({
        id: item.id,
        rol: item.rol,
        fecharegistro: item.fecharegistro,
        activo: item.activo, // Asegúrate de que el backend envíe este campo como booleano
        activo2: item.activo, // Para la columna de acción, puedes usar el mismo campo o uno diferente según tu lógica
      }));
      return roles;
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  };

  const fetchRoles = async () => {
    const rolesData = await listaRoles();
    setRoles(rolesData);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Configuración de comportamiento de las columnas enviada por prop
  const configColumnas: ColumnConfig<Rol>[] = [
    {
      accessorKey: "id",
      header: "ID",
      dataType: "number", // Para formateo específico de números
      tooltip: "Identificador único del Rol",
      visible: false,
    },
    {
      accessorKey: "rol",
      header: "Rol",
      visible: true, // Puedes cambiarlo a false y Tanstack la removerá del renderizado
    },
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
        trueTooltip: "Rol activo",
        falseTooltip: "Rol inactivo",
      },
    },
    {
      accessorKey: "editar",
      header: "Editar",
      dataType: "icon", // Para renderizar como ícono
      sortable: false, // Bloquea el ordenamiento en esta columna
      icon: Pencil1Icon,
      //action: (usuario) => alert(`Editando a: ${usuario.id}`),
      linkPrefix: "/auth/roles/register/", // Hace que el nombre sea un Link a /usuarios/[id]
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
        trueTooltip: "Inhabilitar Rol",
        falseTooltip: "Reactivar Rol",

        action: (rol) => {
          rol.activo
            ? confirmaInactivaRol(rol.id.toString())
            : confirmaActivaRol(rol.id.toString());
        },
      },
    },
  ];

  const botonNuevo: GenericButton = {
    label: "Nuevo Rol",
    onClick: () => router.push("/auth/roles/register"),
    icon: PlusIcon,
    tooltip: "Pulse para agregar un nuevo Rol",
    color: "blue",
  };

  const dataTableProps: GenericTableProps2<Rol> = {
    title: "Gestión de Roles",
    data: roles,
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
