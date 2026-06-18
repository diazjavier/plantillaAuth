"use client";

import { useState, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import { TrashIcon } from "@radix-ui/react-icons";
import { MultiRelationProps, Relacion } from "@/interfaces/generics";

interface GenericRelationProps {
  relationData: MultiRelationProps;
}

export default function GenericMultiRelation({
  relationData,
}: GenericRelationProps) {
  const title = relationData.title;
  const titleEntityA = relationData.entityATitle;
  const LISTA_ENTIDADES_A = relationData.listaA;
  const DISPONIBLES_ENTIDADES_B = relationData.listaB;
  const relaciones = relationData.listaRelacion;

  const [seleccionadoAId, setSeleccionadoAId] = useState<string>("");

  const [relacionesActuales, setRelacionesActuales] = useState<Relacion[]>([]);

  useEffect(() => {
    const primerElemento = LISTA_ENTIDADES_A[0]?.id
      ? LISTA_ENTIDADES_A[0].id.toString()
      : "";
    setSeleccionadoAId(primerElemento);
  }, [relaciones, LISTA_ENTIDADES_A]);

  useEffect(() => {
    setRelacionesActuales(
      relaciones.filter(
        (r) => r.entidadAId.toString() === seleccionadoAId.toString(),
      ),
    );
  }, [seleccionadoAId]);

  const [busquedaA, setBusquedaA] = useState("");
  const [busquedaB, setBusquedaB] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const listaAFiltrada = LISTA_ENTIDADES_A.filter((entidad) =>
    entidad.nombre.toLowerCase().includes(busquedaA.toLowerCase()),
  );

  //   const relacionesActuales = todasLasRelaciones.filter(
  //     (r) => r.entidadAId === seleccionadoAId.toString(),
  //   );

  const resultadosBuscador = DISPONIBLES_ENTIDADES_B.filter((entidad) =>
    entidad.nombre.toLowerCase().includes(busquedaB.toLowerCase()),
  );

  const agregarRelacion = (idB: string, nombreB: string) => {
    if (
      relacionesActuales.some(
        (r) => r.entidadAId === seleccionadoAId && r.entidadBId === idB,
      )
    )
      return;
    setRelacionesActuales([
      ...relacionesActuales,
      {
        entidadAId: seleccionadoAId,
        entidadBId: idB,
        nombreB,
        fechaCaducidad: "",
        isNew: true,
      },
    ]);
    setBusquedaB("");
    setIsPopoverOpen(false);
  };

  const eliminarRelacion = (id: string) => {
    relationData.action?.(id);
    // setRelacionesActuales(
    //   relacionesActuales.filter(
    //     (r) => !(r.entidadAId === seleccionadoAId && r.entidadBId === idB),
    //   ),
    // );
  };

  const guardarCambiosPostgres = async () => {
    setRelacionesActuales(
      relacionesActuales.map((r) =>
        r.entidadAId === seleccionadoAId ? { ...r, isNew: false } : r,
      ),
    );
    alert("Cambios sincronizados en la base de datos.");
  };

  const activeDoc = LISTA_ENTIDADES_A.find(
    (e) => e.id.toString() === seleccionadoAId,
  );

  return (
    <div className="min-h-screen bg-[#EDEFF6] px-8 py-2 font-sans antialiased text-[#04071A]">
      <h2 className="text-2xl font-bold m-4 tracking-tight text-[#04071A]">
        {title}
      </h2>
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col md:flex-row min-h-[750px]">
        {/* --- COLUMNA IZQUIERDA: SPLIT MASTER LIST --- */}
        <div className="w-full md:w-2/3 border-r border-slate-100 bg-[#F8F9FC] flex flex-col">
          {/* Cabecera Izquierda - Alineada con la Derecha */}
          <div className="p-8 border-b border-slate-100 bg-white">
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
          <div className="p-5 bg-white border-b border-slate-100">
            <input
              type="text"
              placeholder="Buscar documento principal..."
              value={busquedaA}
              onChange={(e) => {
                setSeleccionadoAId("");
                setBusquedaA(e.target.value.toString());
              }}
              className="w-full px-4 py-3 text-sm bg-[#F4F5F9] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-slate-200 text-[#04071A] placeholder-[#B4B8CC] transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {listaAFiltrada.map((doc) => {
              const esActivo = doc.id.toString() === seleccionadoAId;
              const tieneNuevos = relacionesActuales.some(
                (r) => r.entidadAId.toString() === doc.id.toString() && r.isNew,
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
                  className={`w-full text-left p-4 rounded-xl flex justify-between items-center transition-all ${
                    esActivo
                      ? "bg-white border border-slate-200/80 shadow-md shadow-slate-100/50 scale-[1.01]"
                      : "hover:bg-slate-200/40 border border-transparent"
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
        <div className="w-full border-r border-slate-100 bg-white flex flex-col">
          {/* Cabecera Derecha */}
          <div className="border-b border-slate-100 bg-white flex flex-col md:flex-row justify-between">
            <div className="p-4 md:p-8">
              <h1 className="text-xl font-bold tracking-tight text-[#04071A]">
                {activeDoc?.nombre}
              </h1>
            </div>

            <div className="hidden p-8 md:flex md:flex-row justify-end">
              <button
                onClick={guardarCambiosPostgres}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>

          {/* Buscador de Entidades B (Alineado simétricamente) */}
          <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <Popover.Anchor asChild>
              <div className="p-5 bg-white border-b border-slate-100">
                <input
                  type="text"
                  placeholder="Escribe para buscar componentes a enlazar..."
                  value={busquedaB}
                  onChange={(e) => {
                    setBusquedaB(e.target.value.toString());
                    setIsPopoverOpen(true);
                  }}
                  onFocus={() => setIsPopoverOpen(true)}
                  className="w-full px-4 py-3 text-sm bg-[#F4F5F9] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-slate-200 text-[#04071A] placeholder-[#B4B8CC] transition-all"
                />
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
          <div className="space-y-4 p-5">
            {relacionesActuales.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-xl p-10 text-center text-[#B4B8CC] text-sm bg-[#F8F9FC]/40">
                No hay elementos relacionados
              </div>
            ) : (
              <div className="space-y-2">
                {relacionesActuales.map((rel) => (
                  <div
                    key={rel.id?.toString()}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-xl border transition-all ${
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
                          eliminarRelacion(rel.id ? rel.id?.toString() : "")
                        }
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all self-end sm:self-center"
                        title="Remover relación"
                      >
                        <TrashIcon className="text-red-400 w-5 h-5"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Caja Inferior de Control de Acciones */}
          <div className="border-t border-slate-100 p-8 flex flex-col md:flex-row justify-end">
            <button
              onClick={guardarCambiosPostgres}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
