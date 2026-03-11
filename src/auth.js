import CredentialsProvider from "next-auth/providers/credentials";
import { loginService } from "@/service/authService";
import { refreshToken } from "@/service/authService";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await loginService({
            email: credentials.email,
            password: credentials.password,
          });
          
          if (res?.status?.code !== "LOGIN_SUCCESS") {
            throw new Error(res?.status?.message || "Login failed");
          }

          if (res?.data?.accessToken) {
            return {
              id: res.data.user.userId,
              username: res.data.user.userName,
              roles: res.data.user.roles,
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
              tokenType: res.data.tokenType,
              expiresIn: res.data.expiresIn,
            };
          }

          return null;

        } catch (error) {
          throw new Error(error.message); 
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {

      // First login
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.roles = user.roles;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.tokenType = user.tokenType;

        // store expiration timestamp
        token.accessTokenExpires = Date.now() + user.expiresIn * 1000;

        return token;
      }

      // If token still valid → return it
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshToken(token);
    },
    async session({ session, token }) {
      if (session && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.roles = token.roles;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.tokenType = token.tokenType;
        session.expiresIn = token.expiresIn;
      }
      return session;
    }
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },
};

export default authOptions;