import { useEffect, useState } from "react";

type ReservationItem = {
  id: number;
  user_email: string;
  name: string;
  phone: string;
  guests: number;
  reservation_date: string;
  reservation_time: string;
  occasion: string;
  table_type: string;
  special_request: string;
  status: string;
};

function Reservation() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: "",
    guests: "2",
    date: "",
    time: "",
    occasion: "Family Dinner",
    tableType: "Indoor",
    message: "",
  });

  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState<number | null>(null);

  const getApiUrl = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://10.201.230.252:8000";
  }

  return import.meta.env.VITE_API_URL;
};

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchReservations = async () => {
    if (!user.email) {
      setReservations([]);
      setPageLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${getApiUrl()}/reservations/${encodeURIComponent(user.email)}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Reservations load nahi ho rahe");
        setReservations([]);
        return;
      }

      setReservations(Array.isArray(data) ? data : []);
    } catch {
      alert("Backend server not running");
      setReservations([]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user.email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email) {
      alert("Please login again");
      return;
    }

    if (
      !formData.name ||
      !formData.phone ||
      !formData.guests ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.phone.length < 10) {
      alert("Please enter valid phone number");
      return;
    }

    const reservationData = {
      user_email: user.email,
      name: formData.name,
      phone: formData.phone,
      guests: Number(formData.guests),
      reservation_date: formData.date,
      reservation_time: formData.time,
      occasion: formData.occasion,
      table_type: formData.tableType,
      special_request: formData.message,
    };

    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Reservation failed");
        return;
      }

      alert(
        `Table reserved successfully!\nReservation ID: ${data.reservation_id}`
      );

      setFormData({
        name: user.name || "",
        phone: "",
        guests: "2",
        date: "",
        time: "",
        occasion: "Family Dinner",
        tableType: "Indoor",
        message: "",
      });

      fetchReservations();
    } catch {
      alert("Backend server not running");
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId: number) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

        setCancelLoadingId(reservationId);

    try {
      const response = await fetch(
        `${getApiUrl()}/reservations/cancel/${reservationId}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Reservation cancel nahi ho paaya");
        return;
      }

      alert(data.message || "Reservation cancelled successfully");

      setReservations((prev) =>
        prev.map((item) =>
          item.id === reservationId
            ? { ...item, status: "Cancelled" }
            : item
        )
      );
    } catch {
      alert("Backend server not running");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const getStatusClass = (status: string) => {
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    if (status === "Confirmed") return "bg-green-100 text-green-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-orange-50 pt-28 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-orange-600 text-center mb-2">
            Reserve a Table
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Book your table at Savory Haven
          </p>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            <input
              name="guests"
              type="number"
              min="1"
              max="20"
              placeholder="Guests"
              value={formData.guests}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            <select
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            >
              <option>Family Dinner</option>
              <option>Birthday</option>
              <option>Anniversary</option>
              <option>Business Meeting</option>
              <option>Other</option>
            </select>

            <select
              name="tableType"
              value={formData.tableType}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            >
              <option>Indoor</option>
              <option>Outdoor</option>
              <option>Window Side</option>
              <option>Rooftop</option>
            </select>

            <textarea
              name="message"
              placeholder="Special Request"
              value={formData.message}
              onChange={handleChange}
              className="border p-3 rounded-xl md:col-span-2"
            />

            <button
              disabled={loading}
              className="md:col-span-2 bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60"
            >
              {loading ? "Reserving..." : "Reserve Now"}
            </button>
          </form>
        </div>

        <div className="mt-10">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">
            My Reservations
          </h2>

          {pageLoading ? (
            <div className="bg-white p-6 rounded-2xl shadow text-center">
              Loading reservations...
            </div>
          ) : reservations.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl shadow text-center">
              <h3 className="text-xl font-bold">No reservations found</h3>
              <p className="text-gray-500 mt-2">
                Aapne abhi tak koi table reserve nahi kiya.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {reservations.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex justify-between flex-wrap gap-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Reservation #{item.id}
                      </h3>
                      <p className="text-gray-500">
                        {item.reservation_date} at {item.reservation_time}
                      </p>
                    </div>

                    <span
                      className={`${getStatusClass(
                        item.status
                      )} px-4 py-2 rounded-full font-semibold`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mt-5 text-gray-700">
                    <p>
                      <b>Name:</b> {item.name}
                    </p>
                    <p>
                      <b>Phone:</b> {item.phone}
                    </p>
                    <p>
                      <b>Guests:</b> {item.guests}
                    </p>
                    <p>
                      <b>Occasion:</b> {item.occasion}
                    </p>
                    <p>
                      <b>Table:</b> {item.table_type}
                    </p>
                    <p>
                      <b>Email:</b> {item.user_email}
                    </p>
                  </div>

                  {item.special_request && (
                    <div className="mt-4 bg-orange-50 p-4 rounded-xl">
                      <b>Special Request:</b>
                      <p className="text-gray-700 mt-1">
                        {item.special_request}
                      </p>
                    </div>
                  )}

                  {item.status === "Pending" && (
                    <button
                      onClick={() => cancelReservation(item.id)}
                      disabled={cancelLoadingId === item.id}
                      className="mt-5 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-60"
                    >
                      {cancelLoadingId === item.id
                        ? "Cancelling..."
                        : "Cancel Reservation"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reservation;