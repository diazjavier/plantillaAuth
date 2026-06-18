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

  const [usuariosActivos, setUsuariosActivos] = useState<ItemMinimo[]>([]);
  const [rolesActivos, setRolesActivos] = useState<ItemMinimo[]>([]);
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

  const listaUsuariosActivos = async () => {
    try {
      const res = await fetch("/api/auth/usuarios/activosmini");
      const data = await res.json();
      const usuariosActivosData =  data.data.map((item: any) => {
        return({
            id: item.id.toString(),
            nombre: item.nombre,
        });
      });
      return usuariosActivosData;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return [];
    }
  };

  const listaRolesActivos = async () => {
    try {
      const res = await fetch("/api/auth/roles/activosmini");
      const data = await res.json();
      const rolesActivosData =  data.data.map((item: any) => {
        return({
            id: item.id.toString(),
            nombre: item.nombre,
        });
      });
      return rolesActivosData;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return [];
    }
  };

  const listaRelacionesActivas = async () => {
    try {
      const res = await fetch("/api/auth/usuarios/roles");
      const data = await res.json();
      const relacionesActivasData = data.data.map((item: any) => {
        return {
          id: item.id.toString(),  
          entidadAId: item.idusuario.toString(),
          entidadBId: item.idrol.toString(),
          nombreB: item.rol,
        };
      });
      return relacionesActivasData;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return [];
    }
  };

  const fetchUsuarios = async () => {
    const usuariosActivosData = await listaUsuariosActivos();
    setUsuariosActivos(usuariosActivosData);
  };

  const fetchRoles = async () => {
    const rolesActivosData = await listaRolesActivos();
    setRolesActivos(rolesActivosData);
  };

  const fetchRelaciones = async () => {
    const relacionesActivasData = await listaRelacionesActivas();
    setRelacionesActivas(relacionesActivasData);
  };

  const eliminaUsuarioRol = async (idRelacion: string) => {
    const response = await fetch(`/api/auth/usuarios/roles/inactivate/${idRelacion}`, {
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
    toast.success(`Rol desvinculado del usuario con éxito con éxito`);
    fetchUsuarios();
  };

  
  const confirmaEliminaUsuarioRol = (id: string) => {
    setConfirmDialogConfig({
      //isOpen: true,
      onClose: () => setConfirmDialogOpen(false),
      title: "Desasignación de Roles a Usuario",
      description: "¿Está seguro de que desea inactivar este rol a este usuario?",
      confirmText: "Inactivar",
      cancelText: "Cancelar",
      confirmColor: "red",
      onConfirm: async () => {
        try {
          await eliminaUsuarioRol(id);
          setConfirmDialogOpen(false);
        } catch (error) {
          toast.error("No se pudo procesar la solicitud");
        }
      },
    });
    setConfirmDialogOpen(true);
  };


  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
    fetchRelaciones()
  }, []);

  const relProps: MultiRelationProps = {
    title: "Relación Usuarios - Roles",
    entityATitle: "Usuarios",
    listaA: usuariosActivos,
    listaB: rolesActivos,
    listaRelacion: relacionesActivas,
    action: (idRelacion) => confirmaEliminaUsuarioRol(idRelacion),
  };

  return (
    <div>
      <GenericMultiRelation relationData={relProps} />
      <ConfirmDialog
        confirmdialog={confirmDialogConfig}
        open={confirmDialogOpen}
      />
    </div>
  );
}
