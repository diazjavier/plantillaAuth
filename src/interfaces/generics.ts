import { ComponentType } from 'react';

export interface GenericTableCell {
    type: string; // text, number, date, money, icon, action, link
    value: string | number;
    origen?: string;
    action?: () => void; // Optional action for action-type cells
    tooltip?: string; // Optional tooltip for icon-type cells
    href?: string; // Optional link URL for link-type cells
    visible: boolean; // Control visibility of the cell
}

export interface GenericTableRow {
    row: GenericTableCell[];
}

export interface GenericTableProps {
    title: string;
    headers: string[];
    rows: GenericTableRow[];
}

interface BooleanDisplayConfig {
  trueIcon: ComponentType<any>;
  falseIcon: ComponentType<any>;
  trueColor?: string;
  falseColor?: string;
  trueTooltip?: string;
  falseTooltip?: string;
}

interface BooleanBadgeConfig {
  trueLabel: string;
  falseLabel: string;
  trueColor?: string;
  falseColor?: string;
  trueTooltip?: string;
  falseTooltip?: string;
}

export interface ColumnConfig<T> {
  accessorKey: keyof T | string; // Clave del objeto o 'actions' para botones personalizados
  header: string;
  visible?: boolean;
  sortable?: boolean;
  tooltip?: string;
  linkPrefix?: string; // Si es un link, ej: '/usuarios/'
  linkIdKey?: keyof T;  // Clave para armar la URL del link, ej: 'id'
  icon?: ComponentType<{ className?: string }>; // Componente de ícono (Radix, Lucide, etc.)
  action?: (row: T) => void; // Función callback para el click
  dataType?: 'text' | 'number' | 'date' | 'money' | 'icon' | 'boolean' | 'state' | 'email'; // Para formateo específico
  textColor?: "ruby" | "blue" | "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky"; // Para íconos, si quieres colores personalizados
  bgColor?: "ruby" | "blue" | "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky"; // Para badges, si quieres colores personalizados
  booleanDisplay?: BooleanDisplayConfig; // Configuración para renderizado de booleanos como íconos
  booleanBadge?: BooleanBadgeConfig; // Configuración para renderizado de booleanos como badges
}

export interface GenericButton {
    label: string;
    onClick: () => void;
    icon?: ComponentType<{ className?: string }>;
    tooltip?: string;
    color?: "ruby" | "blue" | "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky" | undefined;
}

export interface GenericTableProps2<T> {
    title: string;
    data: T[];
    columnsConfig: ColumnConfig<T>[];
    newBoton?: GenericButton; // Configuración opcional para un botón "Nuevo"
}
