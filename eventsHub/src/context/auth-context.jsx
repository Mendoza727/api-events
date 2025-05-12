import { createContext, useContext, useState, useEffect } from "react"
import Swal from "sweetalert2"
import Cookies from "js-cookie"
import { useNavigate, useSearchParams } from 'react-router-dom' // Usar useNavigate
import { AuthLogin, AuthRegister } from "../actions/Auth/login"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()  // Usar useNavigate
    const [searchParams] = useSearchParams()  // Si estás utilizando parámetros de búsqueda en URL

    useEffect(() => {
        const checkLoggedIn = () => {
            try {
                const token = Cookies.get("token")
                const userData = localStorage.getItem("user")

                if (token && userData) {
                    setUser(JSON.parse(userData))
                }
            } catch (error) {
                console.error("Auth error:", error)
                Cookies.remove("token")
                localStorage.removeItem("user")
            } finally {
                setLoading(false)
            }
        }

        checkLoggedIn()
    }, [])

    const login = async (username, password) => {
        try {
            setLoading(true);
            const response = await AuthLogin(username, password);

            if (response?.status === 200) {
                Cookies.set("token", response.data.access, { expires: 7 });

                const userObj = {
                    username: response.data.username,
                    is_staff: response.data.is_staff,
                };

                setUser(userObj);
                localStorage.setItem("user", JSON.stringify(userObj));

                Swal.fire({
                    title: "Success!",
                    text: "You have successfully logged in",
                    icon: "success",
                    confirmButtonColor: "#6d28d9",
                });

                const redirectTo = searchParams.get("redirect") || "/events";
                navigate(redirectTo);

                return true;
            } else {
                Swal.fire({
                    title: "Error!",
                    text: response?.data?.error || "Login failed",
                    icon: "error",
                    confirmButtonColor: "#6d28d9",
                });
            }

            return false;
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Ha ocurrido un error inesperado.";
            Swal.fire({
                title: "Error!",
                text: errorMsg,
                icon: "error",
                confirmButtonColor: "#6d28d9",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };


    const register = async (username, email, password) => {
        try {
            setLoading(true)
            const response = await AuthRegister(username, email, password)

            if (response.status === 201) {
                Cookies.set("token", response.data.access, { expires: 7 })

                const userObj = {
                    username: response.data.username,
                    is_staff: response.data.is_staff,
                }

                setUser(userObj)
                localStorage.setItem("user", JSON.stringify(userObj))

                Swal.fire({
                    title: "Success!",
                    text: "Your account has been created successfully",
                    icon: "success",
                    confirmButtonColor: "#6d28d9",
                })

                navigate("/events")  // Usar navigate en lugar de router.push
                return true
            }

            Swal.fire({
                title: "Error!",
                text: response.message || "Registration failed",
                icon: "error",
                confirmButtonColor: "#6d28d9",
            })
            return false
        } catch (error) {
            console.error("Register error:", error)
            Swal.fire({
                title: "Error!",
                text: "An error occurred during registration",
                icon: "error",
                confirmButtonColor: "#6d28d9",
            })
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        Cookies.remove("token")
        localStorage.removeItem("user")
        setUser(null)
        navigate("/login")  // Usar navigate en lugar de router.push

        Swal.fire({
            title: "Logged out",
            text: "You have been successfully logged out",
            icon: "success",
            confirmButtonColor: "#6d28d9",
        })
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isStaff: user?.is_staff ?? false,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
