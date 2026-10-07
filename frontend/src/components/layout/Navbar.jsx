import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const publicNavItems = [
  { label: "Home", to: "/" },
  { label: "Marketplace", to: "/marketplace" },
];

const privateNavItems = [
  { label: "Home", to: "/" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "My Stock", to: "/my-stock" },
  { label: "Profile", to: "/profile" },
];

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = isAuthenticated
    ? privateNavItems
    : publicNavItems;

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <img
              src="/sene.jpg"
              alt="SENE Logo"
              className="h-12 w-12 rounded-full"
            />

            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                SENE
              </span>

              <span className="ml-2 hidden text-xs font-medium text-gray-500 sm:inline">
                Voice of the Harvest
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <span className="mr-2 text-sm text-gray-600">
                  {user?.fullName}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-3 border-t border-gray-200 pt-3">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {user?.fullName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-1">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="rounded-lg bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;