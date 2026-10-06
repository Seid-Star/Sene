import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setError(error.message || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-[#f8faf8] px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="mt-4 h-4 w-72 rounded bg-gray-200" />
            <div className="mt-8 h-24 rounded-2xl bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f8faf8] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl">
            !
          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Unable to load profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Please sign in to view your profile."}
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const name = user.name || user.fullName || "SENE User";
  const email = user.email || "Not provided";
  const phone = user.phone || "Not provided";
  const role = user.role || "User";

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f8faf8] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-green-700">Account</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your SENE account information.
          </p>
        </div>

        {/* Profile card */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="bg-green-700 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-green-700 shadow-sm">
                {initials}
              </div>

              <div className="text-white">
                <h2 className="text-2xl font-bold">{name}</h2>

                <p className="mt-1 text-sm text-green-100">
                  {email}
                </p>

                <span className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-green-50">
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal information
            </h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Full name
                </p>

                <p className="mt-2 font-medium text-gray-900">
                  {name}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Email
                </p>

                <p className="mt-2 break-all font-medium text-gray-900">
                  {email}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Phone
                </p>

                <p className="mt-2 font-medium text-gray-900">
                  {phone}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Account type
                </p>

                <p className="mt-2 font-medium capitalize text-gray-900">
                  {role}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
              <Link
                to="/marketplace"
                className="rounded-xl bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Go to marketplace
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Log out
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;