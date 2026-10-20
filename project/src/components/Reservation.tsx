import { useEffect, useState } from "react";
import {
  XCircle,
  CalendarCheck,
  User,
  Phone,
  Users,
  CalendarDays,
  Clock,
  PartyPopper,
  UtensilsCrossed,
  MessageSquare,
  Mail,
  CalendarRange,
} from "lucide-react";
import { getAuthHeaders, getAuthUser } from "./authStorage";
import { useToast } from "./Toast";
import ReservationSuccessModal from "./ReservationSuccessModal";

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

type SuccessInfo = {
  id: number | string;
  date: string;
  time: string;
  guests: number | string;
  tableType: string;
};

function Reservation() {
  const user = getAuthUser();
  const toast = useToast();

  // Form fields intentionally start empty (no auto-fill from the
  // logged-in account, and no pre-filled guest count) — only
  // placeholders hint what to type, as requested.
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "",
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
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
  const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null);

  const getApiUrl = () => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://10.201.230.252:8000";
    }

    return import.meta.env.VITE_API_URL;
  };

  // =========================
  // AUTH HEADER
  // Backend ke /reservations routes ko login token
  // chahiye (Depends(get_current_user)). Token na bheja
  // jaye to FastAPI "Not authenticated" bhej deta hai.
  // =========================
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
        `${getApiUrl()}/reservations/${encodeURIComponent(user.email)}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Unable to load reservations");
        setReservations([]);
        return;
      }

      setReservations(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Unable to connect to server");
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
      toast.warning("Please login again");
      return;
    }

    if (
      !formData.name ||
      !formData.phone ||
      !formData.guests ||
      !formData.date ||
      !formData.time
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    if (formData.phone.length < 10) {
      toast.warning("Please enter valid phone number");
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
          ...getAuthHeaders(),
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Reservation failed");
        return;
      }

      // Dedicated UI success popup (bigger than a toast), with the
      // booking details — toast still fires for a quick confirmation.
      toast.success("Table reserved successfully!");
      setSuccessInfo({
        id: data.reservation_id,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        tableType: formData.tableType,
      });

      setFormData({
        name: "",
        phone: "",
        guests: "",
        date: "",
        time: "",
        occasion: "Family Dinner",
        tableType: "Indoor",
        message: "",
      });

      fetchReservations();
    } catch {
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const executeCancelReservation = async (reservationId: number) => {
    setCancelLoadingId(reservationId);

    try {
      // Backend route: PUT /reservations/{reservation_id}/cancel
      const response = await fetch(
        `${getApiUrl()}/reservations/${reservationId}/cancel`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Could not cancel reservation");
        return;
      }

      toast.success(data.message || "Reservation cancelled successfully");

      setReservations((prev) =>
        prev.map((item) =>
          item.id === reservationId
            ? { ...item, status: "Cancelled" }
            : item
        )
      );
    } catch {
      toast.error("Unable to connect to server");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const getStatusClass = (status: string) => {
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    if (status === "Confirmed") return "bg-green-100 text-green-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="relative min-h-screen bg-[#FFF8F0] pt-24 sm:pt-28 px-4 pb-16 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');
        .res-font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      `}</style>

      <div className="pointer-events-none absolute top-10 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-72 h-72 bg-red-200/20 rounded-full blur-3xl" />

      {/* SUCCESS MODAL */}
      {successInfo && (
        <ReservationSuccessModal
          reservationId={successInfo.id}
          date={successInfo.date}
          time={successInfo.time}
          guests={successInfo.guests}
          tableType={successInfo.tableType}
          onClose={() => setSuccessInfo(null)}
        />
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {confirmCancelId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-orange-100 text-center animate-slide-in">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} />
            </div>
            <h3 className="res-font-display text-xl text-[#2A1810] mb-2">
              Cancel Reservation?
            </h3>
            <p className="text-sm text-[#7A6A5E] mb-6">
              Are you sure you want to cancel Reservation #{confirmCancelId}?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmCancelId(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-orange-200 font-semibold text-[#2A1810] hover:bg-orange-50 transition"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = confirmCancelId;
                  setConfirmCancelId(null);
                  executeCancelReservation(id);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md shadow-red-500/30 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase mb-4">
            <CalendarCheck size={14} />
            Reserve Your Table
          </div>

          <h1 className="res-font-display text-3xl sm:text-5xl text-[#2A1810] mb-3">
            Book a Table at{" "}
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
              Savory Haven
            </span>
          </h1>

          <p className="text-[#7A6A5E] text-base sm:text-lg">
            Tell us the details and we'll have your table ready.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 sm:p-10 mb-12">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">

            {/* NAME */}
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
              <input
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-orange-100 bg-[#FFF8F0] text-[#2A1810] placeholder:text-[#9A8A7E] outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition"
              />
            </div>

            {/* PHONE */}
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
              <input
                name="phone"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="off"
                inputMode="numeric"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-orange-100 bg-[#FFF8F0] text-[#2A1810] placeholder:text-[#9A8A7E] outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition"
              />
            </div>

            {/* GUESTS */}
            <div className="relative">
              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
              <input
                name="guests"
                type="number"
                min="1"
                max="20"
                placeholder="Enter number of guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-orange-100 bg-[#FFF8F0] text-[#2A1810] placeholder:text-[#9A8A7E] outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition"
              />
            </div>

            {/* DATE */}
            <div className="relative">
              <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-orange-100 bg-[#FFF8F0] text-[#2A1810] outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition"
              />
            </div>

            {/* TIME */}
            <div className="relative">
              <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
              <input
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-orange-100 bg-[#FFF8F0] text-[#2A1810] outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition"
              />
            </div>

            {/* OCCASION */}
            <div className="relative">
              <PartyPopper size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" />
              <select
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-orange-100 bg-[#FFF8F0] text-[#2A1810] outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition appearance-none"
              >
                <option>Family Dinner</option>
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Business Meeting</option>
                <option>Other</option>
              </select>
            </div>

            {/* TABLE TYPE */}
            <div className="relative">
              <UtensilsCrossed size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" />
              <select
                name="tableType"
                value={formData.tableType}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-orange-100 bg-[#FFF8F0] text-[#2A1810] outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition appearance-none"
              >
                <option>Indoor</option>
                <option>Outdoor</option>
                <option>Window Side</option>
                <option>Rooftop</option>
              </select>
            </div>

            {/* SPECIAL REQUEST */}
            <div className="relative md:col-span-2">
              <MessageSquare size={18} className="absolute left-4 top-4 text-orange-500" />
              <textarea
                name="message"
                placeholder="Any special request? (optional)"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-orange-100 bg-[#FFF8F0] text-[#2A1810] placeholder:text-[#9A8A7E] outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition resize-none"
              />
            </div>

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="md:col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 transition-all"
            >
              <CalendarCheck size={19} />
              {loading ? "Reserving..." : "Reserve Now"}
            </button>
          </form>
        </div>

        {/* MY RESERVATIONS */}
        <div>
          <h2 className="res-font-display text-2xl sm:text-3xl text-[#2A1810] mb-6">
            My Reservations
          </h2>

          {pageLoading ? (
            <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm text-center text-[#7A6A5E]">
              Loading reservations...
            </div>
          ) : reservations.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-orange-100 shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                <CalendarRange size={26} />
              </div>
              <h3 className="res-font-display text-xl text-[#2A1810]">No reservations found</h3>
              <p className="text-[#9A8A7E] mt-2">
                Aapne abhi tak koi table reserve nahi kiya.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {reservations.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex justify-between flex-wrap gap-3">
                    <div>
                      <h3 className="res-font-display text-xl sm:text-2xl text-[#2A1810]">
                        Reservation #{item.id}
                      </h3>
                      <p className="text-[#7A6A5E] flex items-center gap-1.5 mt-1">
                        <CalendarDays size={14} />
                        {item.reservation_date} at {item.reservation_time}
                      </p>
                    </div>

                    <span
                      className={`${getStatusClass(
                        item.status
                      )} px-4 py-1.5 h-fit rounded-full font-bold text-sm`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mt-5 text-sm">
                    <p className="flex items-center gap-2 text-[#5C4A3D]">
                      <User size={15} className="text-orange-500 shrink-0" />
                      <span className="text-[#9A8A7E]">Name:</span> {item.name}
                    </p>
                    <p className="flex items-center gap-2 text-[#5C4A3D]">
                      <Phone size={15} className="text-orange-500 shrink-0" />
                      <span className="text-[#9A8A7E]">Phone:</span> {item.phone}
                    </p>
                    <p className="flex items-center gap-2 text-[#5C4A3D]">
                      <Users size={15} className="text-orange-500 shrink-0" />
                      <span className="text-[#9A8A7E]">Guests:</span> {item.guests}
                    </p>
                    <p className="flex items-center gap-2 text-[#5C4A3D]">
                      <PartyPopper size={15} className="text-orange-500 shrink-0" />
                      <span className="text-[#9A8A7E]">Occasion:</span> {item.occasion}
                    </p>
                    <p className="flex items-center gap-2 text-[#5C4A3D]">
                      <UtensilsCrossed size={15} className="text-orange-500 shrink-0" />
                      <span className="text-[#9A8A7E]">Table:</span> {item.table_type}
                    </p>
                    <p className="flex items-center gap-2 text-[#5C4A3D]">
                      <Mail size={15} className="text-orange-500 shrink-0" />
                      <span className="text-[#9A8A7E]">Email:</span> {item.user_email}
                    </p>
                  </div>

                  {item.special_request && (
                    <div className="mt-4 bg-[#FFF8F0] p-4 rounded-2xl border border-orange-100">
                      <b className="text-[#2A1810]">Special Request:</b>
                      <p className="text-[#5C4A3D] mt-1">
                        {item.special_request}
                      </p>
                    </div>
                  )}

                  {item.status === "Pending" && (
                    <button
                      onClick={() => setConfirmCancelId(item.id)}
                      disabled={cancelLoadingId === item.id}
                      className="mt-5 bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-60 transition"
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