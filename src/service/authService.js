import { apiRequest } from "@/lib/api";

// resigter new user
export const registerService = async ({ username, email, password }) => {
    try {
        const res = await apiRequest("/user/register", "POST", {
            username,
            email,
            password,
        }, null);
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
        console.error("Login service error:", error);
        return null;
    };
};
