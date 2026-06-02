"use client";

import { Flex, Table, Tooltip } from "@radix-ui/themes";
import { CrossCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import {
  GenericTableProps,
  GenericTableRow,
  GenericTableCell,
} from "@/interfaces/generics";
import { formatCurrency, formatDate } from "@/utils/functions";

interface GenericDataTableProps {
  datatable: GenericTableProps;
}

function GenericTable({ datatable }: GenericDataTableProps) {
  const { title, headers, rows } = datatable;
  // const arrayOrdenado = [...arrData].sort((a, b) => b.pxu - a.pxu);

  return (
    <Flex direction="column" gap="5" maxWidth="100%">
      <div className="p-4 text-center">
        <h1 className="text-[20px] text-gray-700 font-bold">{title}</h1>
      </div>
      <Table.Root size="3" variant="surface">
        <Table.Header>
          <Table.Row className="text-lg">
            {headers.map((item: string, index: number) => {
              return (
                <Table.ColumnHeaderCell key={index}>
                  {item}
                </Table.ColumnHeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.map((item: GenericTableRow, index: number) => (
            <Table.Row key={index}>
              {item.row.map((cell: GenericTableCell, cellIndex: number) => {
                console.log("cell.tooltip: ", cell.tooltip);
                if(cell.tooltip && cell.tooltip !== "") {
                      return (
                  <Table.Cell key={cellIndex}>
                    <Tooltip content={cell.tooltip}>
                      <span className="cursor-help">{cell.value}</span>
                      </Tooltip>
                   </Table.Cell>
                    )
                  } else {
                return (
                  <Table.Cell key={cellIndex}>
                      <span>{cell.value}</span>
                   </Table.Cell>
                    )}

                if (cell.type === "text" || cell.type === "number") {
                  return (
                    <Table.Cell key={cellIndex}>
                      <Tooltip content={cell.tooltip || ""}>
                        {cell.value}
                      </Tooltip>
                    </Table.Cell>
                  );
                } else if (cell.type === "money") {
                  return (
                    <Table.Cell key={cellIndex}>
                      <Tooltip content={cell.tooltip || ""}>
                        {formatCurrency(cell.value)}
                      </Tooltip>
                    </Table.Cell>
                  );
                } else if (cell.type === "date") {
                  return (
                    <Table.Cell key={cellIndex}>
                      <Tooltip content={cell.tooltip || ""}>
                        {formatDate(cell.value.toString())}
                      </Tooltip>
                    </Table.Cell>
                  );
                } else if (cell.type === "icon") {
                  return (
                    <Table.Cell key={cellIndex}>
                      <Tooltip content={cell.tooltip || ""}>
                        {cell.origen ?? cell.value}
                      </Tooltip>
                    </Table.Cell>
                  );
                } else if (cell.type === "action") {
                  return (
                    <Table.Cell key={cellIndex}>
                      <Tooltip content={cell.tooltip || ""}>
                        <button
                          onClick={cell.action}
                          className="text-blue-500 hover:underline"
                        >
                          {cell.origen ?? cell.value}
                        </button>
                      </Tooltip>
                    </Table.Cell>
                  );
                } else if (cell.type === "link") {
                  return (
                    <Table.Cell key={cellIndex}>
                      <a
                        href={cell.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {cell.origen ?? cell.value}
                      </a>
                    </Table.Cell>
                  );
                } else {
                  return (
                    <Table.Cell key={cellIndex}>
                      <Tooltip content={cell.tooltip || ""}>
                        {cell.value}
                      </Tooltip>
                    </Table.Cell>
                  );
                }
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}

export default GenericTable;
