import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    preferredLanguage: "am",
    region: "",
    town: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register(formData);
      navigate("/marketplace");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f8faf8] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 lg:grid-cols-2">
        {/* Form */}
        <div className="order-2 p-6 sm:p-10 lg:order-1 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <img
                src="/sene.jpg"
                alt="SENE Logo"
                className="h-16 w-16 rounded-full"
              />

              <p className="mt-4 text-sm font-semibold text-green-700">
                Join SENE
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Start buying and selling agricultural produce.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  minLength={2}
                  maxLength={80}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Optional
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+251 9XX XXX XXX"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Use your Ethiopian phone number
                </p>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                />
              </div>

              {/* Preferred Language */}
              <div>
                <label
                  htmlFor="preferredLanguage"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Preferred language
                </label>

                <select
                  id="preferredLanguage"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
                >
                  <option value="am">Amharic</option>
                  <option value="om">Afaan Oromoo</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Region + Town */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="region"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Region
                  </label>

                  <input
                    id="region"
                    name="region"
                    type="text"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="e.g. Oromia"
                    maxLength={60}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="town"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Town
                  </label>

                  <input
                    id="town"
                    name="town"
                    type="text"
                    value={formData.town}
                    onChange={handleChange}
                    placeholder="e.g. Adama"
                    maxLength={60}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-green-700 hover:text-green-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="order-1 hidden bg-green-700 p-12 text-white lg:order-2 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-bold text-green-700">
              S
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-200">
              Voice of the Harvest
            </p>

            <h2 className="max-w-md text-4xl font-bold leading-tight">
              A simpler marketplace for agricultural trade.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-green-100">
              Find produce, discover market prices, and manage your
              agricultural business from one place.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">01</p>
              <p className="mt-1 text-xs text-green-100">Market prices</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">02</p>
              <p className="mt-1 text-xs text-green-100">Produce listings</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">03</p>
              <p className="mt-1 text-xs text-green-100">Voice access</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
