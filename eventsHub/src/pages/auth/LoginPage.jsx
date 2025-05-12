import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom" // Cambié useHistory por useNavigate
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../context/auth-context"


export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate() // Usamos useNavigate aquí
  const { login, isAuthenticated } = useAuth()
  const location = useLocation()
  const redirectPath = new URLSearchParams(location.search).get("redirect")

  // Si el usuario ya está autenticado, redirigir a la página de eventos
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath || "/events") // Cambié history.push por navigate
    }
  }, [isAuthenticated, navigate, redirectPath])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await login(username, password)
      // La redirección se maneja en el contexto de autenticación
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to EventHub</h1>
            <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="/forgot-password" className="text-sm font-medium text-purple-700 hover:text-purple-800">
                    Forgot password?
                  </a>
                </div>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="font-medium text-purple-700 hover:text-purple-800">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
