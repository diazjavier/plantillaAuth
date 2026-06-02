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
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";

import { useForm, Controller } from "react-hook-form";

function SignUpForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      comentario: "",
    },
  });
  const router = useRouter();
  const onSubmit = handleSubmit(async (data) => {
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
      return;
    }

    router.push("/");
  });

  return (
    <Card className="w-full">
      <Heading size="6" className="mb-4 text-center p-4">
        Sign Up
      </Heading>
      <form onSubmit={onSubmit}>
        <Flex direction="column" gap="2" className="p-4 font-bold">
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
                message: "El largo mínimo de la contraseña es de 6 caracteres",
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

          {/* <Flex
            direction="row"
            gap="4"
            justify="between"
            className="my-4 w-full"
          > */}
          <Flex direction="column" className="my-4">
            <Button type="submit" className="w-100%">
              Sign Up
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
