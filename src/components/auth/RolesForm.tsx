"use client";

import {
  Card,
  Heading,
  Flex,
  TextField,
  Button,
  TextArea,
  Text,
  Switch,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useForm, Controller } from "react-hook-form";
import { RolProps } from "@/interfaces/generics";

interface RolFormProps {
  rolData?: RolProps;
}

function RolesForm({ rolData }: RolFormProps) {
  const isEdit = !!rolData; // Si userData existe, estamos editando, de lo contrario, es un nuevo registro
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rol: rolData?.rol || "",
      comentario: rolData?.comentario || "",
      activo: rolData?.activo || false,
    },
  });

  const onSubmit = handleSubmit(async (data: RolProps) => {
    if (isEdit) {
      // Edita un rol existente
      const response = await fetch(`/api/auth/roles/register/${rolData?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.status !== 201) {
        // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
        toast.error("Error al actualizar");
        return;
      }
      toast.success("Rol actualizado correctamente");
      router.push("/auth/roles");
    } else {
      // Crea un nuevo rol
      const response = await fetch("/api/auth/roles/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.status !== 201) {
        // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
        toast.error("Error al crear el Rol");
        return;
      }
      toast.success("Rol creado correctamente");
      router.push("/auth/roles");
    }
  });

  return (
    <Card className="w-full">
      <Heading size="6" className="mb-2 text-center p-2">
        {isEdit ? `Editar rol ${rolData?.rol}` : "Nuevo Rol"}
      </Heading>
      <form onSubmit={onSubmit}>
        <Flex direction="column" gap="2" className="p-2 font-bold">
          <label htmlFor="rol">Rol</label>
          <Controller
            name="rol"
            control={control}
            rules={{
              required: {
                value: true,
                message: "El campo Rol es obligatorio",
              },
              minLength: {
                value: 3,
                message: "El largo mínimo del Rol es de 3 caracteres",
              },
            }}
            render={({ field }) => {
              return (
                <TextField.Root
                  id="rol"
                  type="text"
                  placeholder="Rol"
                  autoFocus={true}
                  {...field}
                >
                </TextField.Root>
              );
            }}
          />
          {errors.rol?.message && (
            <Text className="text-red-500 text-xs">
              {errors.rol?.message?.toString()}
            </Text>
          )}

          <label htmlFor="comentario">Comentario</label>
          <Controller
            name="comentario"
            control={control}
            rules={{
              required: {
                value: false,
                message: "El campo comentario es obligatorio",
              },
            }}
            render={({ field }) => {
              return (
                <TextArea
                  id="comentario"
                  resize="vertical"
                  placeholder="Escriba su comentario aquí ..."
                  autoFocus={false}
                  {...field}
                />
              );
            }}
          />

          {/* NUEVO CONTROL: Switch para el estado Activo */}
          {isEdit && (
            <Flex direction="row" align="center" gap="3" className="my-2 p-1">
              <Controller
                name="activo"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="activo"
                    checked={field.value} // Sincroniza el booleano
                    onCheckedChange={field.onChange} // Actualiza react-hook-form al hacer click
                  />
                )}
              />
              <label htmlFor="activo" className="cursor-pointer text-sm">
                Rol Activo
              </label>
            </Flex>
          )}

          <Flex direction="row" justify="between" className="my-2 w-full">
            <Button
              type="button"
              variant="solid"
              className="cursor-pointer text-white! bg-gray-400! hover:bg-gray-500! transition-colors w-32"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>

            <Button type="submit" className="cursor-pointer w-32">
              Guardar
            </Button>
          </Flex>
          {/* <Flex direction="column" className="my-4 w-1/3">
              <Button className="w-100%">Sign In2</Button>
            </Flex> */}
          {/* </Flex> */}
        </Flex>
      </form>
    </Card>
  );
}

export default RolesForm;
