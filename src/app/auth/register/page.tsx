import { Container, Text, Flex } from "@radix-ui/themes";
import SignUpForm from "@/components/auth/SignUpForm";
import NavLink from "next/link";

function RegisterPage() {
  return (
    <>
      <div className="flex h-screen w-full justify-center items-center m-2">
        <Flex direction="column" gap="2" className="w-full md:w-1/3 items-center">
          <SignUpForm />
          <Container size="1" className="w-full text-center p-2 text-sm">
            <Text>Ya tiene una cuenta? </Text>
            <NavLink href="/auth/login" className="text-blue-600 underline">Inicie sesión</NavLink>
          </Container>
        </Flex>
      </div>
    </>
  );
}

export default RegisterPage;
