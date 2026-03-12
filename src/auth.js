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

          // Handle both camelCase and snake_case from backend
          const accessToken = res.data?.accessToken || res.data?.access_token;
          const refreshTokenValue = res.data?.refreshToken || res.data?.refresh_token;
          const expiresIn = res.data?.expiresIn || res.data?.expires_in;

          if (accessToken) {
            return {
              id: res.data.user?.userId || res.data.user?.id,
              username: res.data.user?.userName || res.data.user?.username,
              roles: res.data.user?.roles,
              accessToken,
              refreshToken: refreshTokenValue,
              tokenType: res.data?.tokenType || res.data?.token_type,
              expiresIn: expiresIn || 3600, // Default to 1 hour if not provided
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
        console.log("JWT Callback - Initial Login:", user.username);
        token.id = user.id;
        token.username = user.username;
        token.roles = user.roles;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.tokenType = user.tokenType;

        // store expiration timestamp
        token.accessTokenExpires = Date.now() + user.expiresIn * 1000;

        console.log("JWT Callback - Token Expires At:", new Date(token.accessTokenExpires).toLocaleString());
        return token;
      }

      // If token still valid → return it
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      console.log("JWT Callback - Token expired, attempting refresh...");
      if (!token.refreshToken) {
        console.error("JWT Callback - No refresh token available!");
        return { ...token, error: "RefreshTokenError" };
      }

      try {
        const refreshedToken = await refreshToken(token);
        console.log("JWT Callback - Refresh successful");
        return refreshedToken;
      } catch (error) {
        console.error("JWT Callback - Refresh failed:", error.message);
        return { ...token, error: "RefreshTokenError" };
      }
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