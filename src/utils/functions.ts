import { format } from "date-fns";
import * as XLSX from "xlsx";

export function toUpper(txtMin: string | undefined) {
  if (txtMin) {
    const txtMay = txtMin.toUpperCase();
    return txtMay;
  } else {
    return "";
  }
}

export const formatCurrency = (value: number | string) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numericValue)) return "$ 0,00";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(numericValue);
};

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "dd/MM/yyyy").toString();

  // const date = new Date(dateString);
  // const day = String(date.getDate()).padStart(2, '0');
  // const month = String(date.getMonth() + 1).padStart(2, '0');
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
}

export function getColorClass(value: string): string {
  switch (value.toLowerCase()) {
    case "activo":
      return "text-green-500";
    case "inactivo":
      return "text-red-500";
    case "pendiente":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  } 
}

export function getBadgeColorClass(value: string): string {
  switch (value.toLowerCase()) {
    case "activo":
      return "bg-green-100 text-green-800";
    case "inactivo":
      return "bg-red-100 text-red-800";
    case "pendiente":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function exportToExcel(data: any[], fileName: string) {
  // 1. Convertimos el array de objetos directamente a una hoja de trabajo (worksheet)
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // 2. Creamos un libro de trabajo (workbook) vacío
  const workbook = XLSX.utils.book_new();
  
  // 3. Añadimos la hoja al libro con un nombre corto (máx 31 caracteres)
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  
  // 4. Generamos el archivo y disparamos la descarga en el navegador
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
