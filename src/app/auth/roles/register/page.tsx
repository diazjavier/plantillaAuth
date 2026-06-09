import { Container, Text, Flex } from "@radix-ui/themes";
import RolesForm from "@/components/auth/RolesForm";
import NavLink from "next/link";

async function RegisterRolPage() {
  return (
    <>
      <div className="flex h-screen w-full justify-center items-center m-2">
        <Flex
          direction="column"
          gap="2"
          className="w-full md:w-1/3 items-center"
        >
          <RolesForm />
        </Flex>
      </div>
    </>
  );
}

export default RegisterRolPage;
