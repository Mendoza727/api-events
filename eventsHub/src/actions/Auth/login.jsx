import { GestorApi } from "../../config/api/GestorApi";

export const AuthLogin = async (username, password) => {
    username = username.toLowerCase().trim();

    try {
        const { data, status } = await GestorApi.post("login/", {
            username,
            password
        });

        return { data, status };
    } catch (error) {
        const mensaje = error.response?.data?.error || "Ocurrió un error";
        return {
            data: { error: mensaje },
            status: error.response?.status || 500
        };
    }
};


export const AuthRegister = async (username, email, password) => {
    username.trim()
    email.trim()

    try {
        const { data, status } = await GestorApi.post("register/", {
            username,
            email,
            password
        });

        return {
            data,
            status
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}