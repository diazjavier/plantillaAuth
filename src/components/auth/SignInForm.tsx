"use client";
import {
  AvatarIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  Heading,
  Flex,
  TextField,
  Button,
  Text,
} from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function SignInForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(
    {
      defaultValues: {
        user: "",
        password: "",
      },
    }
  );

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      redirect: false,
      name: data.user,
      password: data.password,
      // callbackUrl: "/dashboard/comerciales",
      callbackUrl: "/",
    });
  

    if (!res?.ok) {
      // Manejar el error de inicio de sesión aquí, por ejemplo, mostrando un mensaje al usuario
      console.log("Error al iniciar sesión: ", res?.error);
    };

    router.push(res?.url || "/");

  });

  return (
    <Card className="w-full">
      <Heading size="6" className="mb-4 text-center p-4">
        Sign In
      </Heading>
      <form onSubmit={onSubmit}>
        <Flex direction="column" gap="2" className="p-4 font-bold">
          <label htmlFor="user">Usuario</label>
          <Controller
            name="user"
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
                  // defaultValue=""
                  // value={field.value ?? ""}
                  {...field}
                  // onChange={field.onChange}
                  // onBlur={field.onBlur}
                  // ref={field.ref}
                >
                  <TextField.Slot>
                    <AvatarIcon height={16} width={16} />
                  </TextField.Slot>
                </TextField.Root>
              );
            }}
          />
          {errors.user?.message && (
            <Text className="text-red-500 text-xs">
              {errors.user?.message?.toString()}
            </Text>
          )}

          {/* <label htmlFor="email">Email</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: {
                value: true,
                message: "El campo email es obligatorio",
              },
            }}
            render={({ field }) => {
              return (
                <TextField.Root
                  id="email"
                  type="email"
                  placeholder="yourname@yourmail.com"
                  defaultValue=""
                  autoFocus={false}
                    {...field}
                >
                  <TextField.Slot>
                    <EnvelopeClosedIcon height={16} width={16} />
                  </TextField.Slot>
                </TextField.Root>
              );
            }}
          /> */}

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

          {/* <TextArea resize="vertical" placeholder="Your message..." /> */}

          {/* <Flex
            direction="row"
            gap="4"
            justify="between"
            className="my-4 w-full"
          > */}
          <Flex direction="column" className="my-4">
            <Button type="submit" className="w-100%">
              Ingresar
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

export default SignInForm;
