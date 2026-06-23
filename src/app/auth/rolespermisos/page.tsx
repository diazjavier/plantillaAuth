"use client";

import GenericMultiRelation from "@/components/GenericMultiRelation";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  ConfirmDialogProps,
  ItemMinimo,
  MultiRelationProps,
  Relacion,
} from "@/interfaces/generics";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function UsuariosRoles() {
  const [rolesActivos, setRolesActivos] = useState<ItemMinimo[]>([]);
  const [permisosActivos, setPermisosActivos] = useState<ItemMinimo[]>([]);
  const [relacionesActivas, setRelacionesActivas] = useState<Relacion[]>([]);
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

  const [relProps, setRelProps] = useState<MultiRelationProps>();

  const listaRolesActivos = async () => {
    try {
      const res = await fetch("/api/auth/roles/activosmini");
      const data = await res.json();
      const rolesActivosData = data.data.map((item: any) => {
        return {
          id: item.id.toString(),
          nombre: item.nombre,
        };
      });
      return rolesActivosData;
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  };

  const listaPermisosActivos = async () => {
    try {
      const res = await fetch("/api/auth/permisos/activosmini");
      const data = await res.json();
      const permisosActivosData = data.data.map((item: any) => {
        return {
          id: item.id.toString(),
          nombre: item.nombre,
        };
      });
      return permisosActivosData;
    } catch (error) {
      console.error("Error fetching permisos:", error);
      return [];
    }
  };

  const listaRelacionesActivas = async () => {
    try {
      const res = await fetch("/api/auth/roles/permisos");
      const data = await res.json();
      console.log("Data: ", data);
      const relacionesActivasData = data.data.map((item: any) => {
        return {
          id: item.id.toString(),
          entidadAId: item.idrol.toString(),
          entidadBId: item.idpermiso.toString(),
          nombreB: item.permiso,
        };
      });
      return relacionesActivasData;
    } catch (error) {
      console.error("Error fetching relaciones:", error);
      return [];
    }
  };

  const fetchRoles = async () => {
    const rolesActivosData = await listaRolesActivos();
    setRolesActivos(rolesActivosData);
  };

  const fetchPermisos = async () => {
    const permisosActivosData = await listaPermisosActivos();
    setPermisosActivos(permisosActivosData);
  };

  const fetchRelaciones = async () => {
    const relacionesActivasData = await listaRelacionesActivas();
    setRelacionesActivas(relacionesActivasData);
  };

  const eliminaRolPermiso = async (idRelacion: string) => {
    const response = await fetch(
      `/api/auth/roles/permisos/inactivate/${idRelacion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const res = await response.json();
    if (response.status !== 200) {
      // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
      console.log("Error al inactivar el permiso: ", res.error);
      return;
    }
    toast.success(`Permiso desvinculado del rol con éxito`);
    fetchRelaciones();
    // return relacionesActivas;
  };

  const agregaRolPermiso = async (relacs: Relacion[]) => {
    const relacionesMini = relacs.map(({ entidadAId, entidadBId }) => ({
      entidadAId,
      entidadBId,
    }));

    const response = await fetch(`/api/auth/roles/permisos/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(relacionesMini),
    });
    const res = await response.json();
    if (response.status !== 201) {
      // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
      console.log("Error en la asignación de permisos: ", res.error);
      return;
    }
    toast.success(`Permisos asignados con éxito`);
    fetchRelaciones();
    // return relacionesActivas;
  };

  const confirmaEliminaRelaciones = (id: string) => {
    setConfirmDialogConfig({
      //isOpen: true,
      onClose: () => setConfirmDialogOpen(false),
      title: "Desasignación de Permisos a Roles",
      description:
        "¿Está seguro de que desea inactivar este permiso a este rol?",
      confirmText: "Inactivar",
      cancelText: "Cancelar",
      confirmColor: "red",
      onConfirm: async () => {
        try {
          setConfirmDialogOpen(false);
          //return await eliminaUsuarioRol(id);
          eliminaRolPermiso(id);
        } catch (error) {
          toast.error("No se pudo procesar la solicitud");
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const confirmaAgregaRelaciones = (agregadas: Relacion[]) => {
    setConfirmDialogConfig({
      //isOpen: true,
      onClose: () => setConfirmDialogOpen(false),
      title: "Asignación de Permisos",
      description:
        "¿Está seguro de que desea asignar estos permisos a este rol?",
      confirmText: "Asignar",
      cancelText: "Cancelar",
      confirmColor: "green",
      onConfirm: async () => {
        try {
          setConfirmDialogOpen(false);
          //return await eliminaUsuarioRol(id);
          agregaRolPermiso(agregadas);
        } catch (error) {
          toast.error("No se pudo procesar la solicitud");
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const actualizaProps = () => {
    setRelProps({
      title: "Relación Roles - Permisos",
      entityATitle: "Roles",
      relationTitle: "Permisos asignados",
      relationSubtitle: "Permisos asignados al rol: ",
      listaA: rolesActivos,
      listaB: permisosActivos,
      listaRelacion: relacionesActivas,
      elimina: (idRelacion: string) => confirmaEliminaRelaciones(idRelacion),
      agrega: (relacionesAgregadas: Relacion[]) => confirmaAgregaRelaciones(relacionesAgregadas),
    });
  };

  useEffect(() => {
    actualizaProps();
  }, [relacionesActivas]);

  useEffect(() => {
    fetchRoles();
    fetchPermisos();
    fetchRelaciones();
  }, []);

  return (
    <div>
      {" "}
      {relProps && (
        <>
          <GenericMultiRelation relationData={relProps} />
          <ConfirmDialog
            confirmdialog={confirmDialogConfig}
            open={confirmDialogOpen}
          />
        </>
      )}
    </div>
  );
}
