import { Container, Text, Flex } from "@radix-ui/themes";
import PermisosForm from "@/components/auth/PermisosForm";


async function RegisterPermisoPage() {
  return (
    <>
      <div className="flex h-screen w-full justify-center items-center m-2">
        <Flex
          direction="column"
          gap="2"
          className="w-full md:w-1/3 items-center"
        >
          <PermisosForm />
        </Flex>
      </div>
    </>
  );
}

export default RegisterPermisoPage;
