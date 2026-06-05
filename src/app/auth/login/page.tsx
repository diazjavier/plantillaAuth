import { Container, Text, Flex } from "@radix-ui/themes";
import SignInForm from "@/components/auth/SignInForm";
import NavLink from "next/link";

function LoginPage() {
  return (
    <>
      <div className="flex h-screen w-full justify-center items-center m-2">
        <Flex direction="column" gap="2" className="w-full md:w-1/3 items-center">
          <SignInForm />
          <Container size="1" className="w-full text-center p-2 text-sm">
              <Text>No tiene una cuenta? </Text>
                <NavLink href="/auth/register" className="text-blue-600 underline">Regístrese</NavLink>
          </Container>
        </Flex>
      </div>
    </>
  );
}

export default LoginPage;
