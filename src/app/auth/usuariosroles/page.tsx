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

export default function UsuariosRoles() {
  // const LISTA_ENTIDADES_A = [
  //   {
  //     id: "A-101",
  //     nombre: "Estrategia Global de Marketing",
  //   },
  //   {
  //     id: "A-102",
  //     nombre: "Campaña de Lanzamiento Q3",
  //   },
  //   {
  //     id: "A-103",
  //     nombre: "Auditoría de Canales Digitales",
  //   },
  // ];

  // const DISPONIBLES_ENTIDADES_B = [
  //   { id: "B-1", nombre: "Google Ads Network Assets" },
  //   { id: "B-2", nombre: "Facebook Video Creative" },
  //   { id: "B-3", nombre: "Copywriting Newsletter Kit" },
  //   { id: "B-4", nombre: "Instagram Reel Master Template" },
  // ];

//   const relaciones = [
//     {
//       entidadAId: "1",
//       entidadBId: "B-1",
//       nombreB: "Google Ads Banner",
//       fechaCaducidad: "2026-12-31",
//     },
//     {
//       entidadAId: "1",
//       entidadBId: "B-3",
//       nombreB: "Newsletter Copywriting",
//       fechaCaducidad: "",
//     },
//     {
//       entidadAId: "3",
//       entidadBId: "B-2",
//       nombreB: "Facebook Video Ad",
//       fechaCaducidad: "2026-11-15",
//     },
//   ];

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
