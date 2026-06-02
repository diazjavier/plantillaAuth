import { format } from "date-fns";

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
