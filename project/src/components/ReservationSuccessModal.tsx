import { CheckCircle2, X, CalendarDays, Clock, Users, UtensilsCrossed, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// =========================================================
// RESERVATION SUCCESS MODAL
// Shown right after a table is booked successfully — a
// dedicated, more prominent UI "alert" instead of just a
// toast, matching the espresso-brown / orange-red theme
// used across the redesigned pages (Fraunces display font).
// =========================================================

type ReservationSuccessModalProps = {
  reservationId: number | string;
  date: string;
  time: string;
  guests: number | string;
  tableType: string;
  onClose: () => void;
};

export default function ReservationSuccessModal({
  reservationId,
  date,
  time,
  guests,
  tableType,
  onClose,
}: ReservationSuccessModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');
        .rsm-font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      `}</style>

      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center animate-slide-in border border-orange-100">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-[#9A8A7E] hover:text-[#2A1810] transition"
        >
          <X size={20} />
        </button>

        {/* Big animated check */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 flex items-center justify-center shadow-md">
            <CheckCircle2 size={48} className="text-green-500" strokeWidth={1.8} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="rsm-font-display text-2xl sm:text-3xl text-[#2A1810] mb-1">
          Table Reserved! 🎉
        </h2>
        <p className="text-sm text-[#7A6A5E] mb-6">
          We can't wait to host you at Savory Haven.
        </p>

        {/* Reservation Details */}
        <div className="bg-[#FFF8F0] rounded-2xl p-4 space-y-3 text-left mb-6 border border-orange-100">
          <div className="flex justify-between text-sm">
            <span className="text-[#9A8A7E] font-medium">Reservation ID</span>
            <span className="font-bold text-[#2A1810]">#{reservationId}</span>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="text-[#9A8A7E] font-medium flex items-center gap-1.5">
              <CalendarDays size={14} /> Date
            </span>
            <span className="font-semibold text-[#2A1810]">{date}</span>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="text-[#9A8A7E] font-medium flex items-center gap-1.5">
              <Clock size={14} /> Time
            </span>
            <span className="font-semibold text-[#2A1810]">{time}</span>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="text-[#9A8A7E] font-medium flex items-center gap-1.5">
              <Users size={14} /> Guests
            </span>
            <span className="font-semibold text-[#2A1810]">{guests}</span>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="text-[#9A8A7E] font-medium flex items-center gap-1.5">
              <UtensilsCrossed size={14} /> Table
            </span>
            <span className="font-semibold text-[#2A1810]">{tableType}</span>
          </div>

          <div className="flex justify-between text-sm pt-1 border-t border-orange-100">
            <span className="text-[#9A8A7E] font-medium">Status</span>
            <span className="inline-flex items-center gap-1.5 text-amber-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Pending Confirmation
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 transition-all"
          >
            View My Reservations
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/home");
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-[#2A1810] font-bold text-sm border border-orange-200 hover:border-orange-400 hover:text-orange-600 hover:-translate-y-0.5 transition-all"
          >
            Back to Home
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}