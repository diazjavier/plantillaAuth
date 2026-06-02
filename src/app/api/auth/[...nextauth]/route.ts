import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { conn } from "@/utils/dbConnection";
import { getUsuarioByName } from "@/utils/queries";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        // email: {
        //   label: "Email",
        //   type: "email",
        //   placeholder: "user@domain.com",
        // },
        name: {
          label: "Name",
          type: "text",
          placeholder: "usuario",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "*******",
        },
      },
      //   async authorize(credentials) {
      //     // Add your own logic here to validate the credentials
      //     if (credentials.username === "admin" && credentials.password === "password") {
      //       return { id: "1", name: "Admin", email: "admin@example.com" };
      //     }
      //     return null;
      //   }
      async authorize(credentials, req) {

        const { name, password } = credentials as { name: string | undefined; password: string | undefined };

        const query = getUsuarioByName(name as string);
        const response = await conn.query(query);

        const userFound = response.rows[0];
        
        if (!userFound) throw new Error("Invalid username or password");
        
        const validPassword = await bcrypt.compare(password as string, userFound.password as string);

        if (!validPassword) throw new Error("Invalid username or password");
        return { id: userFound.id, name: userFound.username, email: userFound.email };
      },
    }),
  ],

  callbacks: {
    // 1. Persistimos los datos del usuario en el Token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        //token.email = user.email;
        // token.role = user.role; // Agrega aquí lo que necesites
      }
      return token;
    },
    // 2. Pasamos los datos del Token a la Sesión para que el cliente los vea
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).name = token.name;
        //(session.user as any).email = token.email;
        // (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: { signIn: "/auth/login" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
