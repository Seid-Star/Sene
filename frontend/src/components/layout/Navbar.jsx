import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Marketplace", to: "/marketplace" },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white">
            S
          </div>

          <div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              SENE
            </span>
            <span className="ml-2 hidden text-xs font-medium text-gray-500 sm:inline">
              Voice of the Harvest
            </span>
          </div>
        </Link>

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

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:block"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;