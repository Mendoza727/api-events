import { useState } from "react"
import { Menu, X, User, LogOut, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "../context/auth-context"
import { useLocation } from "react-router-dom"

export default function Navbar() {
    const { pathname } = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false) // Estado para el dropdown del perfil
    const { user, isAuthenticated, isStaff, logout, loading } = useAuth()

    const isActive = (path) => pathname === path

    const buttonStyles = "px-4 py-2 rounded-md text-sm font-medium"

    if (loading) {
        return (
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <a href="/" className="text-2xl font-bold text-purple-700">
                            EventHub
                        </a>
                        <div className="animate-pulse h-8 w-32 bg-gray-200 rounded" />
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <a href="/" className="text-2xl font-bold text-purple-700">
                        EventHub
                    </a>

                    <nav className="hidden md:flex items-center space-x-8">
                        <a
                            href="/"
                            className={`text-sm font-medium transition-colors ${isActive("/") ? "text-purple-700" : "text-gray-700 hover:text-purple-700"
                                }`}
                        >
                            Home
                        </a>
                        {isAuthenticated && (
                            <>
                                <a
                                    href="/events"
                                    className={`text-sm font-medium transition-colors ${isActive("/events") ? "text-purple-700" : "text-gray-700 hover:text-purple-700"
                                        }`}
                                >
                                    Events
                                </a>

                                <a
                                    href="/my-purchases"
                                    className={`text-sm font-medium transition-colors ${isActive("/my-purchases")
                                            ? "text-purple-700"
                                            : "text-gray-700 hover:text-purple-700"
                                        }`}
                                >
                                    My Purchases
                                </a>
                            </>
                        )}
                        {isAuthenticated && isStaff && (
                            <a
                                href="/my-events"
                                className={`text-sm font-medium transition-colors ${isActive("/my-events") ? "text-purple-700" : "text-gray-700 hover:text-purple-700"
                                    }`}
                            >
                                My Events
                            </a>
                        )}
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <div className="relative">
                                    <button
                                        className="flex items-center space-x-2 bg-white p-2 rounded-full border hover:bg-purple-50"
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} // Toggle dropdown
                                    >
                                        <User className="h-5 w-5" />
                                        <span>{user?.name}</span>
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                                            <a
                                                href="/my-purchases"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                                            >
                                                My Purchases
                                            </a>
                                            {isStaff && (
                                                <a
                                                    href="/my-events"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                                                >
                                                    My Events
                                                </a>
                                            )}
                                            <div className="border-t">
                                                <button
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 w-full text-left"
                                                    onClick={logout}
                                                >
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {isStaff && (
                                    <a href="/events/create">
                                        <button className={`${buttonStyles} bg-purple-700 text-white hover:bg-purple-800`}>
                                            Create Event
                                        </button>
                                    </a>
                                )}
                            </>
                        ) : (
                            <>
                                <a href="/login">
                                    <button className={`${buttonStyles} text-purple-700 hover:bg-purple-100`}>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign in
                                    </button>
                                </a>
                                <a href="/register">
                                    <button className={`${buttonStyles} bg-purple-700 text-white hover:bg-purple-800`}>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Sign up
                                    </button>
                                </a>
                            </>
                        )}
                    </div>

                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a
                            href="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/")
                                    ? "bg-purple-100 text-purple-700"
                                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </a>
                        <a
                            href="/events"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/events")
                                    ? "bg-purple-100 text-purple-700"
                                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Events
                        </a>

                        {isAuthenticated ? (
                            <>
                                <a
                                    href="/my-purchases"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/my-purchases")
                                            ? "bg-purple-100 text-purple-700"
                                            : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Purchases
                                </a>

                                {isStaff && (
                                    <>
                                        <a
                                            href="/my-events"
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/my-events")
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            My Events
                                        </a>
                                        <a
                                            href="/events/create"
                                            className={`block px-3 py-2 rounded-md text-base font-medium bg-purple-700 text-white hover:bg-purple-800`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Create Event
                                        </a>
                                    </>
                                )}

                                <button
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        logout()
                                    }}
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <a
                                    href="/login"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/login")
                                            ? "bg-purple-100 text-purple-700"
                                            : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign in
                                </a>
                                <a
                                    href="/register"
                                    className={`block px-3 py-2 rounded-md text-base font-medium bg-purple-700 text-white hover:bg-purple-800`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign up
                                </a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
