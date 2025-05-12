import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/auth-context"
import Navbar from "@/components/navbar"
import EventsPage from "./pages/events/EventPage"
import MyEventsPage from "./pages/my-events/MyEvents"
import MyPurchasesPage from "./pages/my-purchases/MyPurchases"
import RegisterPage from "./pages/auth/RegisterPage"
import LoginPage from "./pages/auth/LoginPage"
import UpdateEventByIPage from "./pages/events/UpdateEventByIPage"
import GetEventByIdPage from "./pages/events/GetEventByIdPage"
import CreateEventPage from "./pages/events/CreateEventPage"
// import Events from "./pages/Events"

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <p>Loading...</p>

  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Router>
      <AuthProvider>
        <Navbar /> {/* Navbar se agrega aquí */}
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/events" /> : <LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-events"
            element={
              <ProtectedRoute>
                <MyEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-purchases"
            element={
              <ProtectedRoute>
                <MyPurchasesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/create"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/:id/edit"
            element={
              <ProtectedRoute>
                <UpdateEventByIPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <GetEventByIdPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
