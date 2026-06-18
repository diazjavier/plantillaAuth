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

interface Permiso {
  id: string;
  permiso: string;
  fecharegistro: string;
  activo?: boolean; // Para ícono de estado activo/inactivo
}

export default function PermisosPage() {
  const router = useRouter();
  const [permisos, setPermisos] = useState<Permiso[]>([]);
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

  const confirmaActivaPermiso = (id: string) => {
    setConfirmDialogConfig({
      //isOpen: true,
      onClose: () => setConfirmDialogOpen(false),
      title: "Activación de Permisos",
      description: "¿Está seguro de que desea activar este Permiso?",
      confirmText: "Activar",
      cancelText: "Cancelar",
      confirmColor: "green",
      onConfirm: async () => {
        try {
          await activaPermiso(id);
          setConfirmDialogOpen(false);
        } catch (error) {
          // Opcional: Toast de error por si falla la red
          toast.error("No se pudo procesar la solicitud");
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const confirmaInactivaPermiso = (id: string) => {
    setConfirmDialogConfig({
      //isOpen: true,
      onClose: () => setConfirmDialogOpen(false),
      title: "Inactivación de Permisos",
      description: "¿Está seguro de que desea inactivar este Permiso?",
      confirmText: "Inactivar",
      cancelText: "Cancelar",
      confirmColor: "red",
      onConfirm: async () => {
        try {
          await inactivaPermiso(id);
          setConfirmDialogOpen(false);
        } catch (error) {
          toast.error("No se pudo procesar la solicitud");
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const activaPermiso = async (id: string) => {
    const response = await fetch(`/api/auth/permisos/activate/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (response.status !== 200) {
      // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
      console.log("Error al activar el Permiso: ", res.error);
      return;
    }
    toast.success(`Permiso activado con éxito`);
    fetchPermisos();
  };

  const inactivaPermiso = async (id: string) => {
    const response = await fetch(`/api/auth/permisos/inactivate/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (response.status !== 200) {
      // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
      console.log("Error al inactivar el Permiso: ", res.error);
      return;
    }
    toast.success(`Permiso inactivado con éxito`);
    fetchPermisos();
  };

  const listaPermisos = async () => {
    try {
      const res = await fetch("/api/auth/permisos");
      const data = await res.json();
      const permisos: Permiso[] = data.data.map((item: any) => ({
        id: item.id,
        permiso: item.permiso,
        fecharegistro: item.fecharegistro,
        activo: item.activo, // Asegúrate de que el backend envíe este campo como booleano
        activo2: item.activo, // Para la columna de acción, puedes usar el mismo campo o uno diferente según tu lógica
      }));
      return permisos;
    } catch (error) {
      console.error("Error fetching permisos:", error);
      return [];
    }
  };

  const fetchPermisos = async () => {
    const permisosData = await listaPermisos();
    setPermisos(permisosData);
  };

  useEffect(() => {
    fetchPermisos();
  }, []);

  // Configuración de comportamiento de las columnas enviada por prop
  const configColumnas: ColumnConfig<Permiso>[] = [
    {
      accessorKey: "id",
      header: "ID",
      dataType: "number", // Para formateo específico de números
      tooltip: "Identificador único del Permiso",
      visible: false,
    },
    {
      accessorKey: "permiso",
      header: "Permiso",
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
        trueTooltip: "Permiso activo",
        falseTooltip: "Permiso inactivo",
      },
    },
    {
      accessorKey: "editar",
      header: "Editar",
      dataType: "icon", // Para renderizar como ícono
      sortable: false, // Bloquea el ordenamiento en esta columna
      icon: Pencil1Icon,
      //action: (usuario) => alert(`Editando a: ${usuario.id}`),
      linkPrefix: "/auth/permisos/register/", // Hace que el nombre sea un Link a /usuarios/[id]
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
        trueTooltip: "Inhabilitar Permiso",
        falseTooltip: "Reactivar Permiso",

        action: (permiso) => {
          permiso.activo
            ? confirmaInactivaPermiso(permiso.id.toString())
            : confirmaActivaPermiso(permiso.id.toString());
        },
      },
    },
  ];

  const botonNuevo: GenericButton = {
    label: "Nuevo Permiso",
    onClick: () => router.push("/auth/permisos/register"),
    icon: PlusIcon,
    tooltip: "Pulse para agregar un nuevo Permiso",
    color: "blue",
  };

  const dataTableProps: GenericTableProps2<Permiso> = {
    title: "Gestión de Permisos",
    data: permisos,
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
