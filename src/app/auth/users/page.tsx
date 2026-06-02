import GenericTable from "@/components/GenericTable";
import { GenericTableProps } from "@/interfaces/generics";

function Users() {
    const datosTabla: GenericTableProps = {
        title: "Usuarios",
        headers: ["ID", "Nombre", "Email", "Rol"],
        rows: [
            { row: [
                { type: "number", value: 1, visible: true, tooltip: "ID del usuario 1" },
                { type: "text", value: "Juan Pérez", visible: true },
                { type: "text", value: "juan.perez@example.com", visible: true },
                { type: "text", value: "Administrador", visible: true }
            ]},
            { row: [
                { type: "number", value: 2, visible: true },
                { type: "text", value: "María García", visible: true, tooltip: "Nombre completo del usuario 2"},
                { type: "text", value: "maria.garcia@example.com", visible: true },
                { type: "text", value: "Usuario", visible: true }
            ]},
            { row: [
                { type: "number", value: 3, visible: true },
                { type: "text", value: "Carlos López", visible: true },
                { type: "text", value: "carlos.lopez@example.com", visible: true },
                { type: "text", value: "Editor", visible: true, tooltip: "Rol del usuario 3" }
            ]}
        ]
    }

  return (
    <div className="flex flex-col items-center m-8">
      <GenericTable datatable={datosTabla} />
    </div>
  );
}

export default Users;
