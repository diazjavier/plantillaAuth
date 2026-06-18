"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Flex } from "@radix-ui/themes";

// --- MOCKS DE EJEMPLO (Simulación de datos de Postgres) ---
const LISTA_ENTIDADES_A = [
  { id: "A-101", nombre: "Plan de Marketing Digital" },
  { id: "A-102", nombre: "Campaña de Black Friday" },
  { id: "A-103", nombre: "Estrategia SEO 2026" },
];

const DISPONIBLES_ENTIDADES_B = [
  { id: "B-1", nombre: "Google Ads Banner" },
  { id: "B-2", nombre: "Facebook Video Ad" },
  { id: "B-3", nombre: "Newsletter Copywriting" },
  { id: "B-4", nombre: "Instagram Reel Asset" },
];

interface Relacion {
  entidadAId: string;
  entidadBId: string;
  nombreB: string;
  fechaCaducidad: string;
}

export default function AdministradorRelacionesDobleColumna() {
  const [seleccionadoAId, setSeleccionadoAId] = useState<string>(
    LISTA_ENTIDADES_A[0].id,
  );

  const [todasLasRelaciones, setTodasLasRelaciones] = useState<Relacion[]>([
    {
      entidadAId: "A-101",
      entidadBId: "B-1",
      nombreB: "Google Ads Banner",
      fechaCaducidad: "2026-12-31",
    },
    {
      entidadAId: "A-101",
      entidadBId: "B-3",
      nombreB: "Newsletter Copywriting",
      fechaCaducidad: "",
    },
    {
      entidadAId: "A-102",
      entidadBId: "B-2",
      nombreB: "Facebook Video Ad",
      fechaCaducidad: "2026-11-15",
    },
  ]);

  // Estados para buscadores
  const [busquedaA, setBusquedaA] = useState(""); // NUEVO: Buscador de la izquierda
  const [busquedaB, setBusquedaB] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // --- FILTROS Y LÓGICA ---
  // NUEVO: Filtrar lista izquierda (Entidad A)
  const listaAFiltrada = LISTA_ENTIDADES_A.filter((entidad) =>
    entidad.nombre.toLowerCase().includes(busquedaA.toLowerCase()),
  );

  const relacionesActuales = todasLasRelaciones.filter(
    (r) => r.entidadAId === seleccionadoAId,
  );

  const resultadosBuscador = DISPONIBLES_ENTIDADES_B.filter((entidad) =>
    entidad.nombre.toLowerCase().includes(busquedaB.toLowerCase()),
  );

  const agregarRelacion = (idB: string, nombreB: string) => {
    const yaExiste = todasLasRelaciones.some(
      (r) => r.entidadAId === seleccionadoAId && r.entidadBId === idB,
    );
    if (yaExiste) return;

    setTodasLasRelaciones([
      ...todasLasRelaciones,
      {
        entidadAId: seleccionadoAId,
        entidadBId: idB,
        nombreB: nombreB,
        fechaCaducidad: "",
      },
    ]);
    setBusquedaB("");
    setIsPopoverOpen(false);
  };

  const eliminarRelacion = (idB: string) => {
    setTodasLasRelaciones(
      todasLasRelaciones.filter(
        (r) => !(r.entidadAId === seleccionadoAId && r.entidadBId === idB),
      ),
    );
  };

  const cambiarFecha = (idB: string, nuevaFecha: string) => {
    setTodasLasRelaciones(
      todasLasRelaciones.map((r) =>
        r.entidadAId === seleccionadoAId && r.entidadBId === idB
          ? { ...r, fechaCaducidad: nuevaFecha }
          : r,
      ),
    );
  };

  const guardarCambiosPostgres = async () => {
    console.log(
      "Enviando cambios a Postgres para entidad",
      seleccionadoAId,
      ":",
      relacionesActuales,
    );
    alert("Relaciones guardadas correctamente en la base de datos.");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Panel de Vinculación N:N
        </h1>
        <p className="text-sm text-gray-500">
          Gestione las asignaciones y fechas de caducidad entre entidades.
        </p>
      </div>

      {/* CONTENEDOR DE DOS COLUMNAS (ESTRUCTURA ORIGINAL) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* --- COLUMNA IZQUIERDA: LISTA ENTIDAD A --- */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4 max-h-[600px] overflow-y-auto">
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
              Entidades Principales (A)
            </h2>
            {/* NUEVO: Input de búsqueda para la Entidad A */}
            <input
              type="text"
              placeholder="Filtrar entidades..."
              value={busquedaA}
              onChange={(e) => setBusquedaA(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          <div className="space-y-1">
            {listaAFiltrada.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No hay resultados
              </p>
            ) : (
              listaAFiltrada.map((entidadA) => {
                const esSeleccionado = entidadA.id === seleccionadoAId;
                const contadorRelaciones = todasLasRelaciones.filter(
                  (r) => r.entidadAId === entidadA.id,
                ).length;

                return (
                  <button
                    key={entidadA.id}
                    onClick={() => {
                      setSeleccionadoAId(entidadA.id);
                      setBusquedaB("");
                    }}
                    className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition-all ${
                      esSeleccionado
                        ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600 pl-2 shadow-inner"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="truncate text-sm">{entidadA.nombre}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        esSeleccionado
                          ? "bg-blue-200 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {contadorRelaciones}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* --- COLUMNA DERECHA: COMPONENTE DETALLE --- */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[450px]">
          <div className="space-y-6">
            {/* CABECERA DINÁMICA */}
            <div className="border-b border-gray-100 pb-4">
              <Flex justify="between">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-5 py-2 rounded-lg">
                  Elemento Activo
                </span>
                <button
                  onClick={guardarCambiosPostgres}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Guardar Cambios
                </button>
              </Flex>
              <h2 className="text-lg font-bold text-gray-900 mt-2">
                {
                  LISTA_ENTIDADES_A.find((e) => e.id === seleccionadoAId)
                    ?.nombre
                }
              </h2>
            </div>

            {/* BUSCADOR (RADIX POPOVER) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">
                Asignar nueva Entidad B:
              </label>
              <div className="relative w-full">
                <Popover.Root
                  open={isPopoverOpen && resultadosBuscador.length > 0}
                  onOpenChange={setIsPopoverOpen}
                >
                  <Popover.Anchor asChild>
                    <input
                      type="text"
                      placeholder="Escribe para buscar componentes a enlazar..."
                      value={busquedaB}
                      onChange={(e) => {
                        setBusquedaB(e.target.value);
                        setIsPopoverOpen(true);
                      }}
                      onFocus={() => setIsPopoverOpen(true)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </Popover.Anchor>

                  <Popover.Portal>
                    <Popover.Content
                      className="w-[var(--radix-popover-trigger-width)] max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1"
                      align="start"
                      sideOffset={4}
                      onInteractOutside={() => setIsPopoverOpen(false)}
                    >
                      {resultadosBuscador.map((entidadB) => (
                        <button
                          key={entidadB.id}
                          onClick={() =>
                            agregarRelacion(entidadB.id, entidadB.nombre)
                          }
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded transition-colors"
                        >
                          {entidadB.nombre}
                        </button>
                      ))}
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>
            </div>

            {/* LISTA VERTICAL DE ELEMENTOS ASIGNADOS */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Entidades Relacionadas Actualmente
              </h3>

              {relacionesActuales.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
                  No hay elementos de la Entidad B asociados a este registro.
                  Usa el buscador de arriba.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                  {relacionesActuales.map((rel) => (
                    <div
                      key={rel.entidadBId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 gap-4 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {rel.nombreB}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          ID: {rel.entidadBId}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <div className="flex flex-col sm:items-end gap-1">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase">
                            Caducidad
                          </span>
                          <input
                            type="date"
                            value={rel.fechaCaducidad}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                              cambiarFecha(rel.entidadBId, e.target.value)
                            }
                            className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-700 bg-white focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <button
                          onClick={() => eliminarRelacion(rel.entidadBId)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar relación"
                        >
                          <svg
                            xmlns="http://w3.org"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón Guardar Cambios reubicado dentro del recuadro derecho */}
          <div className="border-t border-gray-100 pt-4 flex justify-end">
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
