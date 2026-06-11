"use client";
//import { messages } from "@/utils/messages";
import {
  AvatarIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
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
import { User } from "@/interfaces/auth";

interface UsuarioFormProps {
  userData?: User;
}

function SignUpForm({ userData }: UsuarioFormProps) {
  const isEdit = !!userData; // Si userData existe, estamos editando, de lo contrario, es un nuevo registro
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: userData?.userName || "",
      email: userData?.email || "",
      password: "",
      comentario: userData?.comentario || "",
      activo: userData?.activo || false,
    },
  });

  const onSubmit = handleSubmit(async (data: User) => {
    if (isEdit) {
      // Edita un usuario existente
      const response = await fetch(`/api/auth/register/${userData?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.status !== 201) {
        // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
        console.log("Error al registrarse: ", res.error);
        toast.error("Error al registrarse");
        return;
      }
      toast.success("Usuario actualizado correctamente");
      router.push("/auth/users2");
    } else {
      // Crea un nuevo usuario
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.status !== 201) {
        // Manejar el error de registro aquí, por ejemplo, mostrando un mensaje al usuario
        console.log("Error al registrarse: ", res.error);
        toast.error("Error al registrarse");
        return;
      }
      toast.success("Usuario creado correctamente");
      router.push("/auth/users2");
    }
  });

  return (
    <Card className="w-full">
      <Heading size="6" className="mb-2 text-center p-2">
        {isEdit ? `Editar usuario ${userData?.userName}` : "Nuevo usuario"}
      </Heading>
      <form onSubmit={onSubmit}>
        <Flex direction="column" gap="2" className="p-2 font-bold">
          <label htmlFor="user">Usuario</label>
          <Controller
            name="userName"
            control={control}
            rules={{
              required: {
                value: true,
                message: "El campo usuario es obligatorio",
              },
              minLength: {
                value: 3,
                message: "El largo mínimo del usuario es de 3 caracteres",
              },
            }}
            render={({ field }) => {
              return (
                <TextField.Root
                  id="user"
                  type="text"
                  placeholder="your username"
                  autoFocus={true}
                  {...field}
                >
                  <TextField.Slot>
                    <AvatarIcon height={16} width={16} />
                  </TextField.Slot>
                </TextField.Root>
              );
            }}
          />
          {errors.userName?.message && (
            <Text className="text-red-500 text-xs">
              {errors.userName?.message?.toString()}
            </Text>
          )}

          <label htmlFor="email">Email</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: {
                value: true,
                message: "El campo email es obligatorio",
              },
              minLength: {
                value: 3,
                message: "El largo mínimo del MAIL es de 3 caracteres",
              },
            }}
            render={({ field }) => {
              return (
                <TextField.Root
                  id="email"
                  type="email"
                  placeholder="yourname@yourmail.com"
                  autoFocus={false}
                  {...field}
                >
                  <TextField.Slot>
                    <EnvelopeClosedIcon height={16} width={16} />
                  </TextField.Slot>
                </TextField.Root>
              );
            }}
          />
          {errors.email?.message && (
            <Text className="text-red-500 text-xs">
              {errors.email?.message?.toString()}
            </Text>
          )}
          {!isEdit && (
            <>
              <label htmlFor="password">Password</label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "El campo password es obligatorio",
                  },
                  minLength: {
                    value: 6,
                    message:
                      "El largo mínimo de la contraseña es de 6 caracteres",
                  },
                }}
                render={({ field }) => {
                  return (
                    <TextField.Root
                      id="password"
                      type="password"
                      placeholder="********"
                      autoFocus={false}
                      // defaultValue=""
                      // value={field.value ?? ""}
                      {...field}
                      // onChange={field.onChange}
                      // onBlur={field.onBlur}
                      // ref={field.ref}
                    >
                      <TextField.Slot>
                        <LockClosedIcon height={16} width={16} />
                      </TextField.Slot>
                    </TextField.Root>
                  );
                }}
              />
              {errors.password?.message && (
                <Text className="text-red-500 text-xs">
                  {errors.password?.message?.toString()}
                </Text>
              )}
            </>
          )}
          <label htmlFor="comentario">Comentario</label>
          <Controller
            name="comentario"
            control={control}
            rules={{
              required: {
                value: false,
                message: "El campo email es obligatorio",
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
                  <>
                    <Switch
                      id="activo"
                      checked={field.value} // Sincroniza el booleano
                      onCheckedChange={field.onChange} // Actualiza react-hook-form al hacer click
                    />
                    <label htmlFor="activo" className="cursor-pointer text-sm">
                      {field.value ? "Usuario Activo" : "Usuario Inactivo"}
                    </label>
                  </>
                )}
              />
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

export default SignUpForm;
