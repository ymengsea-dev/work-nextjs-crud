import { apiRequest } from "@/lib/api";

// resigter new user
export const registerService = async ({ username, email, password }) => {
    try {
        console.log("register service is called")
        const res = await apiRequest("/user/register", "POST", {
            username,
            email,
            password,
        }, null);
        console.log("register service res:", res)
        return res
    } catch (error) {
        console.error("register service erorr:", error)
        return null;
    };
};

// login 
export const loginService = async ({ email, password }) => {
    try {
        const res = await apiRequest("/user/login", "POST", {
            email,
            password,
        }, null);
        return res
    } catch (error) {
        console.error("Login service error:", error.message); // log server message
        throw error;
    };
};

export const refreshToken = async (token) => {
    try {
        if (!token.refreshToken) {
            throw new Error("No refresh token provided to refreshToken service");
        }

        console.log("AuthService - refreshing token...");
        const res = await apiRequest("/user/refresh-token", "POST", {
            refreshToken: token.refreshToken
        }, null);

        const newAccessToken = res?.data?.accessToken || res?.data?.access_token;
        const newRefreshToken = res?.data?.refreshToken || res?.data?.refresh_token;
        const expiresIn = res?.data?.expiresIn || res?.data?.expires_in || 3600;

        if (newAccessToken) {
            return {
                ...token,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken || token.refreshToken,
                accessTokenExpires: Date.now() + (expiresIn * 1000)
            };
        }

        console.warn("AuthService - Refresh failed: No access token in response", res);
        return token;
    } catch (error) {
        console.error("AuthService - Refresh error:", error.message);
        throw error;
    }
}