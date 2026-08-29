import { useEffect, useState } from "react";
import { Users, ShoppingBag, CalendarDays, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

type DashboardData = {
  total_users: number;
  total_orders: number;
  total_reservations: number;
  revenue: number;
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData>({
    total_users: 0,
    total_orders: 0,
    total_reservations: 0,
    revenue: 0,
  });

  const getApiUrl = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://10.201.230.252:8000";
  }

  return import.meta.env.VITE_API_URL;
};

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/admin/dashboard`);
        const result = await response.json();

        if (!response.ok) {
          alert(result.detail || "Admin dashboard load nahi ho raha");
          return;
        }

        setData(result);
      } catch {
        alert("Backend server not running");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 pt-28 text-center text-xl font-semibold">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pt-28 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-600">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage orders, reservations and restaurant activity
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl shadow">
            <Users className="text-orange-600 mb-4" size={34} />
            <p className="text-gray-500">Total Users</p>
            <h2 className="text-3xl font-bold">{data.total_users}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <ShoppingBag className="text-orange-600 mb-4" size={34} />
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-3xl font-bold">{data.total_orders}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <CalendarDays className="text-orange-600 mb-4" size={34} />
            <p className="text-gray-500">Reservations</p>
            <h2 className="text-3xl font-bold">{data.total_reservations}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <IndianRupee className="text-orange-600 mb-4" size={34} />
            <p className="text-gray-500">Revenue</p>
            <h2 className="text-3xl font-bold">₹{data.revenue}</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div
            onClick={() => navigate("/admin/orders")}
            className="bg-white p-8 rounded-2xl shadow cursor-pointer hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-bold text-orange-600">
              Manage Orders
            </h2>
            <p className="text-gray-600 mt-2">
              View orders and update order status.
            </p>
          </div>

          <div
            onClick={() => navigate("/admin/reservations")}
            className="bg-white p-8 rounded-2xl shadow cursor-pointer hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-bold text-orange-600">
              Manage Reservations
            </h2>
            <p className="text-gray-600 mt-2">
              Confirm, cancel and manage table bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;