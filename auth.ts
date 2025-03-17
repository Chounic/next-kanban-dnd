import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { KyselyAdapter } from "@auth/kysely-adapter";
import { db, User } from "./lib/kysely";

export class CustomError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
    this.message = code;
    this.stack = undefined;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  adapter: new KyselyAdapter(db),
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials, request) => {
        console.log("🚀 ~ authorize: ~ request:", request);
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        let user: User | undefined;

        try {
          user = await db
            .selectFrom("User")
            .selectAll()
            .where("email", "=", credentials.email as string)
            .executeTakeFirst();
        } catch (error) {
          throw new CustomError("La connection a échouée.");
        }
        if (!user) {
          throw new CustomError("Email ou mot de passe incorrect");
        }

        if (!user.password) {
          throw new CustomError(
            "Il semble que vous ayez créé votre compte avec une autre méthode. Veuillez l'utiliser pour vous connecter."
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new CustomError("Email ou mot de passe incorrect");
        }
        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname === "/";
      if (isOnDashboard) {
        return isLoggedIn;
      }
      if (
        auth &&
        (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")
      ) {
        const newUrl = new URL("/", nextUrl.origin);
        return Response.redirect(newUrl);
      }
      return true;
    },
  },
});
