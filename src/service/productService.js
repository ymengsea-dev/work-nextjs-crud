import { authOptions } from "../auth";

const getProduct = async () => {
    const session = await authOptions();
    const token = session?.accessToken;
    console.log("token:", token);
    try {
        const res = await apiRequest("/product", "GET", null, token);
        return res;
    } catch (error) {
        console.error("Get product error:", error);
        return null;
    };
};