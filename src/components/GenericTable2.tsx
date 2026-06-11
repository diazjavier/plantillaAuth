// components/GenericTable.tsx
"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  createColumnHelper,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import { Table, Button, Flex, Tooltip, TextField } from "@radix-ui/themes";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DownloadIcon,
} from "@radix-ui/react-icons";
import { GenericTableProps2, ArrayBadgeConfig } from "@/interfaces/generics";
import {
  getBadgeColorClass,
  formatDate,
  formatCurrency,
  exportToExcel,
} from "@/utils/functions";

export default function GenericTable2<T extends Record<string, any>>({
  title,
  data,
  columnsConfig,
  newBoton,
}: GenericTableProps2<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // 1. Mapear la configuración personalizada a las columnas reales de TanStack
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<T>();

    return columnsConfig.map((col) => {
      return columnHelper.accessor(col.accessorKey as any, {
        header: col.header,
        enableSorting: col.sortable ?? true,
        // Forzamos a TanStack a ordenar fechas correctamente si se especifica
        sortingFn: col.dataType === "date" ? "datetime" : "auto",
        cell: (info) => {
          const value = info.getValue();
          const rowData = info.row.original;

          // Render de booleanos como íconos con tooltip
          if (col.booleanIcon && typeof value === "boolean") {
            const {
              trueIcon,
              falseIcon,
              trueColor,
              falseColor,
              trueTooltip,
              falseTooltip,
              action,
            } = col.booleanIcon;

            const Icon = value ? trueIcon : falseIcon;
            const tooltip = value ? trueTooltip : falseTooltip;
            const color = value ? trueColor : falseColor;
            // const IconComponent = iconRenderer ? iconRenderer({ rowData }) : Icon;

            return action ? (
              <Tooltip content={tooltip}>
                <Button
                  onClick={() => action?.(rowData)}
                  variant="ghost"
                  className="p-0"
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content={tooltip}>
                <Icon className={`w-5 h-5 ${color}`} />
              </Tooltip>
            );
          }

          if (col.dataType === "arrayText" && Array.isArray(value)) {
            return (
              <Flex gap="1" wrap="wrap" className="max-w-xs">
                {value.map((tag: ArrayBadgeConfig, index: number) => {
                  const badge = (
                    <span
                      key={tag.text + "-" + index}
                      className={`
                      inline-flex items-center
                      rounded-full
                      px-2 py-1
                      text-xs font-medium
                      ${tag.color}`}
                    >
                      {tag.text}
                    </span>
                  );

                  return tag.tooltip ? (
                    <Tooltip key={tag.text + "-" + index} content={tag.tooltip}>
                      {badge}
                    </Tooltip>
                  ) : (
                    badge
                  );
                })}
              </Flex>
            );
          }

          // Render de booleanos como píldoras con tooltip y colores personalizados
          if (col.dataType === "state" && col.booleanBadge) {
            const {
              trueLabel,
              falseLabel,
              trueColor,
              falseColor,
              trueTooltip,
              falseTooltip,
            } = col.booleanBadge;

            const label: string = value
              ? trueLabel
                ? trueLabel
                : ""
              : falseLabel
                ? falseLabel
                : "";
            const color: string = value
              ? trueColor
                ? trueColor
                : ""
              : falseColor
                ? falseColor
                : "";
            const tooltip: string = value
              ? trueTooltip
                ? trueTooltip
                : ""
              : falseTooltip
                ? falseTooltip
                : "";

            const badge = (
              <span
                className={`
                inline-flex items-center
                rounded-full
                px-2 py-1
                text-xs font-medium
                ${getBadgeColorClass(color)}`}
              >
                {label}
              </span>
            );

            return tooltip ? (
              <Tooltip content={tooltip}>
                <span>{badge}</span>
              </Tooltip>
            ) : (
              badge
            );
          }

          // Celda con Ícono + Acción ejecutable
          //          const IconComponent = col.iconRenderer ? col.iconRenderer({ rowData }) : col.icon;

          if (col.dataType === "icon" && col.icon && col.action) {
            return (
              <button
                onClick={() => col.action?.(rowData)}
                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label={col.header}
              >
                <col.icon className="w-5 h-5" />
              </button>
            );
          }
          // Celda con Ícono + link
          else if (col.dataType === "icon" && col.icon && col.linkPrefix) {
            const targetId = col.linkIdKey ? rowData[col.linkIdKey] : "";
            return (
              <Link
                href={`${col.linkPrefix}${targetId}`}
                //target="_blank"
                className="text-blue-500 hover:text-blue-700 hover:bg-gray-100 transition-colors"
                aria-label={col.header}
              >
                <col.icon className="w-5 h-5" />
              </Link>
            );
          }
          // Celda sólo Ícono
          else if (col.dataType === "icon" && col.icon) {
            return (
              <Tooltip content={col.tooltip || ""}>
                <span className="cursor-help">
                  <col.icon
                    className={`w-5 h-5 ${col.textColor ? `text-${col.textColor}-500` : ""} ${col.bgColor ? `bg-${col.bgColor}-100 p-1 rounded` : ""}`}
                  />
                </span>
              </Tooltip>
            );
          }

          // Celda estructurada como Link de Next.js
          if (col.linkPrefix) {
            const targetId = col.linkIdKey ? rowData[col.linkIdKey] : "";
            return (
              <Link
                href={`${col.linkPrefix}${targetId}`}
                target="_blank"
                className="text-blue-500 hover:underline font-medium"
              >
                {String(value)}
              </Link>
            );
          }

          // Celda estructurada como email
          if (col.dataType === "email") {
            return (
              <Link
                href={`mailto:${value}`}
                target="_blank"
                className="text-blue-500 hover:underline font-medium"
              >
                {String(value)}
              </Link>
            );
          }

          if (value === null || value === undefined) return "";

          if (col.dataType === "money") {
            return formatCurrency(value.toString());
          }

          if (col.dataType === "date") {
            return formatDate(value.toString());
          }

          // Celda convencional de texto plano
          return String(value ?? "");
        },
      });
    });
  }, [columnsConfig]);

  // 2. Establecer el estado inicial de visibilidad de las columnas
  const columnVisibility = useMemo(() => {
    const visibilityMap: Record<string, boolean> = {};
    columnsConfig.forEach((col) => {
      visibilityMap[col.accessorKey as string] = col.visible ?? true;
    });
    return visibilityMap;
  }, [columnsConfig]);

  // 3. Inicializar el motor de TanStack Table
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  // Función interna para procesar y limpiar las filas de la tabla antes de enviarlas a Excel
  const handleExport = () => {
    // Obtenemos solo las filas que pasaron el filtro actual del buscador
    const filasFiltradas = table.getFilteredRowModel().rows.map((row) => {
      const objetoOriginal = row.original;
      const filaLimpia: Record<string, any> = {};

      // Iteramos sobre la configuración de tus columnas para armar el Excel ordenado
      columnsConfig.forEach((col) => {
        // Ignoramos columnas de acciones o íconos que no tienen sentido en Excel
        if (col.dataType === "icon" || col.accessorKey === "actions" || col.accessorKey === "activo2") return;

        const valor = objetoOriginal[col.accessorKey as string];

        // Si es tu columna de múltiples píldoras (roles), extraemos el texto separado por comas
        if (col.dataType === "arrayText" && Array.isArray(valor)) {
          filaLimpia[col.header] = valor.map((tag: any) => tag.text).join(", ");
        } 
        // Si es un booleano, lo guardamos como un texto limpio
        else if (typeof valor === "boolean") {
          filaLimpia[col.header] = valor ? "Sí" : "No";
        } 
        // Para cualquier otro dato plano (texto, fechas, emails, sueldos)
        else if (valor !== undefined && valor !== null) {
          filaLimpia[col.header] = valor;
        }
      });

      return filaLimpia;
    });
    // Llamamos a la utilidad pasándole el título de la tabla como nombre de archivo
    exportToExcel(filasFiltradas, title.toLowerCase().replace(/\s+/g, "_"));
  };

  return (
    <Flex direction="column" gap="4" className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
      <Flex justify="between" className="w-full">
        {/* Input de Filtrado Global */}
        <TextField.Root
          placeholder="Buscar en todos los campos..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          //className="max-w-xs"
          className="w-full max-w-sm"
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        {newBoton && (
          <Button
            onClick={newBoton.onClick}
            variant="solid"
            color={newBoton.color || "blue"}
            className="ml-auto"
            title={newBoton.tooltip}
          >
            {newBoton.icon && <newBoton.icon className="w-4 h-4 mr-1" />}
            {newBoton.label}
          </Button>
        )}
        <Button
          variant="outline"
          color="green"
          onClick={handleExport}
          className="cursor-pointer"
          title="Exportar registros filtrados a Excel"
        >
          <DownloadIcon className="w-4 h-4 mr-1" />
          </Button>
      </Flex>

      {/* Renderizado de la estructura de Radix UI */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table.Root variant="surface">
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  const config = columnsConfig.find(
                    (c) => c.accessorKey === header.id,
                  );
                  const isSortable = header.column.getCanSort();

                  // Componente base del Header
                  const headerContent = (
                    <Flex
                      align="center"
                      gap="1"
                      className={isSortable ? "cursor-pointer select-none" : ""}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {isSortable &&
                        ({
                          asc: <ChevronUpIcon className="w-4 h-4" />,
                          desc: <ChevronDownIcon className="w-4 h-4" />,
                        }[header.column.getIsSorted() as string] ??
                          null)}
                    </Flex>
                  );

                  return (
                    <Table.ColumnHeaderCell key={header.id}>
                      {/* Si la columna requiere un Tooltip, lo envolvemos con Radix Themes */}
                      {config?.tooltip ? (
                        <Tooltip content={config.tooltip}>
                          <span>{headerContent}</span>
                        </Tooltip>
                      ) : (
                        headerContent
                      )}
                    </Table.ColumnHeaderCell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Header>

          <Table.Body>
            {table.getRowModel().rows.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={columns.length}
                  className="text-center text-gray-500 py-8"
                >
                  No se encontraron resultados.
                </Table.Cell>
              </Table.Row>
            ) : (
              table.getRowModel().rows.map((row: any) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell: any) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>

      {/* Controles de Paginación */}
      <Flex justify="end" align="center" className="px-1">
        <Flex gap="2">
          <Button
            variant="soft"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            {"< Anterior"}
          </Button>
          <span className="text-sm text-gray-600 pt-2">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="soft"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            {"Siguiente >"}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
