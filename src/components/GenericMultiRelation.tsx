"use client";

import { useState, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  TrashIcon,
  Cross2Icon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Dialog, Button } from "@radix-ui/themes";
import { MultiRelationProps, Relacion } from "@/interfaces/generics";

interface GenericRelationProps {
  relationData: MultiRelationProps;
}

export default function GenericMultiRelation({
  relationData,
}: GenericRelationProps) {
  const title = relationData.title;
  const titleEntityA = relationData.entityATitle;
  const relationTitle = relationData.relationTitle;
  const relationSubtitle = relationData.relationSubtitle;
  const LISTA_ENTIDADES_A = relationData.listaA;
  const DISPONIBLES_ENTIDADES_B = relationData.listaB;

  // const relaciones = relationData.listaRelacion;
  const [open, setOpen] = useState(false);
  const [seleccionadoAId, setSeleccionadoAId] = useState<string>("");
  const [relaciones, setRelaciones] = useState<Relacion[]>(
    relationData.listaRelacion,
  );
  const [relacionesActuales, setRelacionesActuales] = useState<Relacion[]>([]);

  //   useEffect(() => {
  //     const primerElemento = LISTA_ENTIDADES_A[0]?.id
  //       ? LISTA_ENTIDADES_A[0].id.toString()
  //       : "";
  //     setSeleccionadoAId(primerElemento);
  //   }, [relaciones, LISTA_ENTIDADES_A]);

  useEffect(() => {
    if (!seleccionadoAId && LISTA_ENTIDADES_A.length > 0) {
      setSeleccionadoAId(LISTA_ENTIDADES_A[0].id.toString());
    }
  }, [LISTA_ENTIDADES_A]);

  useEffect(() => {
    actualizaRelaciones(seleccionadoAId);
  }, [seleccionadoAId, relaciones]);

  useEffect(() => {
    setRelaciones(relationData.listaRelacion);
  }, [relationData.listaRelacion]);

  const [busquedaA, setBusquedaA] = useState("");
  const [busquedaB, setBusquedaB] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const listaAFiltrada = LISTA_ENTIDADES_A.filter((entidad) =>
    entidad.nombre.toLowerCase().includes(busquedaA.toLowerCase()),
  );

  const resultadosBuscador = DISPONIBLES_ENTIDADES_B.filter((entidad) =>
    entidad.nombre.toLowerCase().includes(busquedaB.toLowerCase()),
  );

  const actualizaRelaciones = (seleccionado: string) => {
    setRelacionesActuales(
      relaciones.filter((r) => r.entidadAId.toString() === seleccionado),
    );
  };

  const agregarRelacion = (idB: string, nombreB: string) => {
    if (
      relacionesActuales.some(
        (r) => r.entidadAId === seleccionadoAId && r.entidadBId === idB,
      )
    )
      return;
    setRelaciones([
      {
        entidadAId: seleccionadoAId,
        entidadBId: idB,
        nombreB,
        fechaCaducidad: "",
        isNew: true,
      },
      ...relaciones,
    ]);
    setBusquedaB("");
    setIsPopoverOpen(false);
  };

  const eliminarRelacion = (id: string, idA: string, idB: string) => {
    if (id === "" || !id) {
      //   setRelacionesActuales(
      //     relacionesActuales.filter(
      //       (rel: any) => !(rel.entidadAId === idA && rel.entidadBId === idB),
      //     ),
      //   );
      setRelaciones(
        relaciones.filter(
          (rel: any) => !(rel.entidadAId === idA && rel.entidadBId === idB),
        ),
      );
    } else {
      if (relaciones.some((r) => r.isNew)) {
        setOpen(true);
      } else {
        relationData.elimina?.(id);
      }
      // setRelacionesActuales(
      //   relacionesActuales.filter(
      //     (r) => !(r.entidadAId === seleccionadoAId && r.entidadBId === idB),
      //   ),
      // );
    }
  };

  const guardarCambios = async () => {
    //    const itemSeleccionado = seleccionadoAId;
    const relacionesAgregadas = relaciones.filter((r) => r.isNew);
    if (relacionesAgregadas.length > 0) {
      relationData.agrega?.(relacionesAgregadas);
    }
    //    setSeleccionadoAId(itemSeleccionado);
  };

  const activeDoc = LISTA_ENTIDADES_A.find(
    (e) => e.id.toString() === seleccionadoAId,
  );

  return (
    <div className=" bg-[#EDEFF6] px-8 py-2 font-sans antialiased text-[#04071A]">
      <h2 className="text-2xl font-bold m-4 tracking-tight text-[#04071A]">
        {title}
      </h2>

      {/* <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col md:flex-row min-h-[750px]"> */}
      <div className=" bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col md:h-[calc(90vh-100px)]">
        <div className=" bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row  md:h-[calc(100vh-100px)]">
          {/* --- COLUMNA IZQUIERDA: SPLIT MASTER LIST --- */}
          <div className="w-full md:w-2/3 border-r border-slate-100 bg-[#F8F9FC] flex flex-col">
            {/* Cabecera Izquierda - Alineada con la Derecha */}
            <div className="px-8 py-4  bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight text-[#04071A]">
                  {titleEntityA}
                </h2>
                <span className="text-xs bg-[#1B16D3]/10 text-[#1B16D3] font-bold px-2 py-0.5 rounded-md font-mono">
                  {listaAFiltrada.length}
                </span>
              </div>
            </div>

            {/* Cuerpo Izquierdo - Buscador y Lista */}
            <div className="px-5 py-2 bg-white border-b border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={busquedaA}
                  onChange={(e) => {
                    setSeleccionadoAId("");
                    setBusquedaA(e.target.value);
                  }}
                  className="w-full px-4 py-1 pr-10 text-sm bg-[#F4F5F9] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-slate-200 text-[#04071A] placeholder-[#B4B8CC] transition-all"
                />

                {busquedaA && (
                  <button
                    type="button"
                    onClick={() => setBusquedaA("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Limpiar búsqueda"
                  >
                    <Cross2Icon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1  min-h-0 bg-white">
              {listaAFiltrada.map((doc) => {
                const esActivo = doc.id.toString() === seleccionadoAId;
                const tieneNuevos = relaciones.some(
                  (r) =>
                    r.entidadAId.toString() === doc.id.toString() && r.isNew,
                );
                const totalRelaciones = relaciones.filter(
                  (r) => r.entidadAId.toString() === doc.id.toString(),
                ).length;

                return (
                  <button
                    key={doc.id.toString()}
                    onClick={() => {
                      setSeleccionadoAId(doc.id.toString());
                      setBusquedaB("");
                    }}
                    className={`w-full text-left px-4 py-2 rounded-xl flex justify-between items-center transition-all ${
                      !esActivo
                        ? "bg-white border border-slate-200/80 shadow-md shadow-slate-100/50 scale-[1.01]"
                        : "bg-slate-200/40 border border-transparent"
                    }`}
                  >
                    <div className="flex gap-3 items-center truncate">
                      <div className="truncate">
                        <p
                          className={`text-sm font-medium ${esActivo ? "text-[#04071A]" : "text-[#484B61]"}`}
                        >
                          {doc.nombre}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {tieneNuevos && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-mono ${totalRelaciones === 0 ? "bg-slate-100 text-red-400" : "bg-slate-200/40 text-[#484B61]"}`}
                      >
                        {totalRelaciones}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- COLUMNA DERECHA: DOCUMENT DETAIL AREA --- */}
          <div className="w-full border-r border-slate-100 bg-white flex flex-col  min-h-0">
            {/* Cabecera Derecha */}
            <div className=" bg-white flex flex-col md:flex-row justify-between">
              <div className="p-4 md:px-8 py-4">
                <h1 className="text-xl font-bold tracking-tight text-[#04071A]">
                  {relationTitle}
                </h1>
              </div>
              <div className="hidden px-8 py-4 md:flex md:flex-row justify-end">
                <button
                  onClick={guardarCambios}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>

            {/* Buscador de Entidades B (Alineado simétricamente) */}
            <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <Popover.Anchor asChild>
                <div className="px-5 py-2 bg-white border-b border-slate-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Escribe para buscar componentes a enlazar..."
                      value={busquedaB}
                      onChange={(e) => {
                        setBusquedaB(e.target.value);
                        setIsPopoverOpen(true);
                      }}
                      onFocus={() => setIsPopoverOpen(true)}
                      className="w-full px-4 py-1 pr-10 text-sm bg-[#F4F5F9] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-slate-200"
                    />

                    {busquedaB && (
                      <button
                        type="button"
                        onClick={() => {
                          setBusquedaB("");
                          setIsPopoverOpen(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label="Limpiar búsqueda"
                      >
                        <Cross2Icon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </Popover.Anchor>
              <Popover.Portal>
                <Popover.Content
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className="w-[var(--radix-popover-trigger-width)] max-h-52 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 animate-in fade-in-50 duration-150"
                >
                  {resultadosBuscador.map((entidadB) => (
                    <button
                      key={entidadB.id.toString()}
                      onClick={() =>
                        agregarRelacion(entidadB.id, entidadB.nombre)
                      }
                      className="w-full text-left px-3 py-2 text-sm text-[#484B61] hover:bg-[#1B16D3]/5 hover:text-[#1B16D3] rounded-lg transition-colors font-medium"
                    >
                      {entidadB.nombre}
                    </button>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* Listado de Entidades Relacionadas */}
            {/* <div className="space-y-4 p-5"> */}
            <div className="px-8 py-2  shadow-md  sticky top-0 bg-white z-10">
              <h3 className="text-l font-bold tracking-tight text-[#04071A] flex flex-row">
                {relationSubtitle}{" "}
                <p className="bg-blue-200 rounded px-2 mx-2">
                  {activeDoc?.nombre}
                </p>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-5 min-h-0">
              {relacionesActuales.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-xl p-10 text-center text-[#B4B8CC] text-sm bg-[#F8F9FC]/40">
                  No hay elementos relacionados
                </div>
              ) : (
                <div className="space-y-2">
                  {relacionesActuales.map((rel) => (
                    <div
                      key={rel.id?.toString() + "-" + rel.nombreB}
                      className={`flex flex-row items-center justify-between px-2 rounded-xl border transition-all ${
                        rel.isNew
                          ? "bg-amber-50/60 border-amber-300 shadow-sm shadow-amber-100/50"
                          : "bg-white border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      {/* Metadatos del hijo */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#04071A]">
                            {rel.nombreB}
                          </span>
                          {rel.isNew && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                              Pendiente Guardar
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Inputs interactivos */}
                      <div className="flex items-center gap-4 mt-3 sm:mt-0 justify-between sm:justify-end">
                        <button
                          onClick={() =>
                            eliminarRelacion(
                              rel.id ? rel.id?.toString() : "",
                              rel.entidadAId,
                              rel.entidadBId,
                            )
                          }
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all self-end sm:self-center"
                          title="Remover relación"
                        >
                          <TrashIcon className="text-red-400 w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Caja Inferior de Control de Acciones */}
        <div className="border-t border-slate-100 px-8 py-4 flex flex-col md:flex-row justify-end">
          <button
            onClick={guardarCambios}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>
            {" "}
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />
              <span>Hay operaciones pendientes</span>
            </div>
          </Dialog.Title>

          <Dialog.Description size="2" mb="4">
            Por favor finalice las operaciones pendientes antes de eliminar una
            relación
          </Dialog.Description>

          <div className="flex justify-end">
            <Button
              variant="surface"
              color="gray"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
