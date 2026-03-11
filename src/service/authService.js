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
        const res = await apiRequest("/user/refresh-token", "POST", {
            refreshToken: token.refreshToken
        }, null);
        
        if (res?.data?.accessToken) {
            return {
                ...token,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken || token.refreshToken,
                accessTokenExpires: Date.now() + (res.data.expiresIn * 1000)
            };
        }
        
        return token;
    } catch (error){
        throw error;
    }
}