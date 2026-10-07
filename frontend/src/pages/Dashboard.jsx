import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.fullName}
        </h1>

        <p className="mt-2 text-gray-600">
          This is your SENE dashboard.
        </p>
      </div>
    </main>
  );
}

export default Dashboard;