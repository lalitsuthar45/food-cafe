import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  UtensilsCrossed,
  Copy,
  Check,
  ShieldCheck,
  KeyRound,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Hash,
  Banknote,
  Smartphone,
  CreditCard,
  Lock,
  ReceiptText,
  Truck,
} from "lucide-react";
import { getAuthHeaders, getAuthUser } from "./authStorage";
import { useToast } from "./Toast";
import OrderSuccessModal from "./OrderSuccessModal";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartPageProps = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

type PaymentMethod = "COD" | "UPI" | "CARD";

function CartPage({ cartItems, setCartItems }: CartPageProps) {
  const navigate = useNavigate();
  const toast = useToast();

  const [fullName, setFullName] = useState("");
  // Email jaan-bujh kar khaali shuru hota hai (auto-fill nahi) —
  // sirf placeholder se pata chalega ki kya bharna hai.
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("COD");

  const [upiId, setUpiId] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);

  // Order success modal state
  const [successModal, setSuccessModal] = useState<{
    show: boolean;
    orderId: number | string;
    grandTotal: number;
    paymentMethod: string;
  }>({ show: false, orderId: "", grandTotal: 0, paymentMethod: "" });

  // OTP Center Modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // =========================
  // CART TOTAL
  // =========================

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const gst = Math.round(itemsTotal * 0.05);

  const deliveryCharge =
    itemsTotal > 499 || itemsTotal === 0 ? 0 : 40;

  const discount = itemsTotal > 999 ? 100 : 0;

  const grandTotal =
    itemsTotal + gst + deliveryCharge - discount;

  // =========================
  // API URL
  // =========================

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
  // Backend ke /orders route ko login token chahiye
  // (Depends(get_current_user)). Token na bheja jaye to
  // FastAPI "Not authenticated" bhej deta hai.
  // =========================
  // =========================
  // REMOVE ITEM
  // =========================

  const removeItem = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // =========================
  // CARD NUMBER
  // =========================

  const handleCardNumberChange = (value: string) => {
    const digitsOnly = value
      .replace(/\D/g, "")
      .slice(0, 16);

    const formatted = digitsOnly
      .replace(/(.{4})/g, "$1 ")
      .trim();

    setCardNumber(formatted);
  };

  // =========================
  // EXPIRY
  // =========================

  const handleExpiryChange = (value: string) => {
    const digitsOnly = value
      .replace(/\D/g, "")
      .slice(0, 4);

    if (digitsOnly.length >= 3) {
      setExpiry(
        `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
      );
    } else {
      setExpiry(digitsOnly);
    }
  };

  // =========================
  // UPI VALIDATION
  // =========================

  const isValidUpi = (value: string) => {
    return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(value);
  };

  // =========================
  // EMAIL VALIDATION
  // =========================

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // =========================
  // SEND OTP
  // =========================

  const handleSendOtp = () => {
    if (!mobile || mobile.length < 10) {
      toast.warning("Please enter valid mobile number");
      return;
    }

    const randomOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    setGeneratedOtp(randomOtp);
    setOtpVerified(false);
    setShowOtpModal(true);
    setCopiedOtp(false);
  };

  const copyOtpToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedOtp);
      setCopiedOtp(true);
      toast.success("OTP copied to clipboard!");
      setTimeout(() => setCopiedOtp(false), 2500);
    } catch {
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2500);
    }
  };

  const autoFillOtp = () => {
    setOtp(generatedOtp);
    setOtpVerified(true);
    setShowOtpModal(false);
    toast.success("OTP auto-filled and verified! ✅");
  };

  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOtp = () => {
    if (!generatedOtp) {
      toast.warning("Please send OTP first");
      return;
    }

    if (otp === generatedOtp) {
      setOtpVerified(true);
      toast.success("OTP verified successfully ✅");
    } else {
      setOtpVerified(false);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  // =========================
  // PAYMENT VALIDATION
  // =========================

  const validatePayment = () => {
    if (paymentMethod === "COD") {
      return true;
    }

    if (paymentMethod === "UPI") {
      if (!upiId) {
        toast.warning("Please enter UPI ID");
        return false;
      }

      if (!isValidUpi(upiId)) {
        toast.warning(
          "Please enter valid UPI ID. Example: lalit@okaxis"
        );
        return false;
      }

      return true;
    }

    if (paymentMethod === "CARD") {
      const cleanCard = cardNumber.replace(/\s/g, "");

      if (!cleanCard || cleanCard.length !== 16) {
        toast.warning("Please enter valid 16 digit card number");
        return false;
      }

      if (!cardHolder) {
        toast.warning("Please enter card holder name");
        return false;
      }

      if (!expiry || expiry.length !== 5) {
        toast.warning("Please enter valid expiry date MM/YY");
        return false;
      }

      if (!cvv || cvv.length < 3) {
        toast.warning("Please enter valid CVV");
        return false;
      }

      return true;
    }

    return false;
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.warning("Cart is empty");
      return;
    }

    if (
      !fullName ||
      !email ||
      !address ||
      !city ||
      !pincode ||
      !mobile
    ) {
      toast.warning("Please fill all delivery details");
      return;
    }

    if (!isValidEmail(email)) {
      toast.warning("Please enter a valid email address");
      return;
    }

    if (!otpVerified) {
      toast.warning("Please verify OTP first");
      return;
    }

    if (!validatePayment()) {
      return;
    }

    const user = getAuthUser();

    if (!user.email) {
      toast.error("User not found. Please login again.");
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    const orderData = {
      user_email: user.email,
      customer_name: fullName,
      // Order-specific contact email (editable here, prefilled
      // from the logged-in account). Backends that don't use
      // this field yet will simply ignore it.
      contact_email: email,
      phone: mobile,
      address,
      city,
      pincode,

      payment_method:
        paymentMethod === "COD"
          ? "Cash on Delivery"
          : paymentMethod === "UPI"
          ? `UPI - ${upiId}`
          : `Card - ****${cleanCardNumber.slice(-4)}`,

      items_total: itemsTotal,
      gst,
      delivery_charge: deliveryCharge,
      discount,
      grand_total: grandTotal,

      items: cartItems.map((item) => ({
        food_name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
    };

    setLoading(true);

    try {
      const response = await fetch(
        `${getApiUrl()}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Order failed");
        return;
      }

      // Show beautiful success modal
      setSuccessModal({
        show: true,
        orderId: data.order_id,
        grandTotal: data.grand_total,
        paymentMethod: orderData.payment_method,
      });

      // Clear cart after successful order
      setCartItems([]);

      // Reset delivery/payment fields — email bhi khaali hi
      // reset hoti hai (auto-fill nahi karte)
      setFullName("");
      setEmail("");
      setAddress("");
      setCity("");
      setPincode("");
      setMobile("");
      setOtp("");
      setGeneratedOtp("");
      setOtpVerified(false);
      setUpiId("");
      setCardNumber("");
      setCardHolder("");
      setExpiry("");
      setCvv("");
      setPaymentMethod("COD");
    } catch {
      toast.error("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions: {
    id: PaymentMethod;
    label: string;
    sub: string;
    icon: typeof Banknote;
  }[] = [
    { id: "COD", label: "Cash on Delivery", sub: "Pay when it arrives", icon: Banknote },
    { id: "UPI", label: "UPI Payment", sub: "GPay, PhonePe, Paytm", icon: Smartphone },
    { id: "CARD", label: "Card", sub: "Debit / Credit", icon: CreditCard },
  ];

  return (
    <div className="relative min-h-screen bg-[#FFF8F0] pt-24 px-4 pb-28 lg:pb-16 overflow-hidden">
      {/* fonts, matching the rest of the site */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');
        .cart-font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      `}</style>

      {/* decorative blur glows, matching About/Contact/Gallery sections */}
      <div className="pointer-events-none absolute -top-24 -left-20 w-80 h-80 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-red-300/15 blur-3xl" />

      {/* Order Success Modal */}
      {successModal.show && (
        <OrderSuccessModal
          orderId={successModal.orderId}
          grandTotal={successModal.grandTotal}
          paymentMethod={successModal.paymentMethod}
          onClose={() => setSuccessModal((s) => ({ ...s, show: false }))}
        />
      )}

      {/* Demo OTP Center Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="
              relative w-full max-w-sm sm:max-w-md
              bg-white dark:bg-slate-900
              rounded-3xl shadow-2xl
              p-6 sm:p-8
              border border-orange-100 dark:border-slate-800
              text-center
              animate-slide-in
            "
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-1"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <ShieldCheck size={36} />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
              Verification Code
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
              Use this demo OTP to verify delivery to <span className="font-semibold text-gray-800 dark:text-gray-200">+91 {mobile}</span>
            </p>

            {/* Big OTP Display */}
            <div className="bg-orange-50/80 dark:bg-slate-800/80 border-2 border-dashed border-orange-300 dark:border-orange-500/40 rounded-2xl p-4 mb-6">
              <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 tracking-wider uppercase mb-1">
                Your One-Time Password
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-[0.35em] pl-[0.35em]">
                {generatedOtp}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={copyOtpToClipboard}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-orange-500 text-orange-600 dark:text-orange-400 font-bold text-sm hover:bg-orange-50 dark:hover:bg-slate-800 transition active:scale-95"
              >
                {copiedOtp ? (
                  <>
                    <Check size={18} className="text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy OTP
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={autoFillOtp}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:from-orange-700 hover:to-red-600 transition active:scale-95"
              >
                <KeyRound size={18} />
                Auto-Fill & Verify
              </button>
            </div>

            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-4">
              Demo OTP simulation • No SMS charges applied
            </p>
          </div>
        </div>
      )}

      <div className="relative max-w-6xl mx-auto">

        {/* =========================
            TITLE
        ========================= */}

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase mb-3">
            <ShoppingBag size={14} />
            Checkout
          </span>

          <h1 className="cart-font-display text-3xl sm:text-4xl font-semibold text-[#2A1810]">
            Your Cart
          </h1>

          {cartItems.length > 0 && (
            <p className="text-[#7A6A5E] mt-1.5">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} ready for checkout
            </p>
          )}
        </div>

        {/* =========================
            EMPTY CART
        ========================= */}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg shadow-orange-100 border border-orange-100 p-10 sm:p-14 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
              <ShoppingBag size={38} />
            </div>

            <h2 className="cart-font-display text-2xl font-semibold text-[#2A1810]">
              Your cart is empty
            </h2>

            <p className="text-[#7A6A5E] mt-2 max-w-sm mx-auto">
              Looks like you haven't added anything yet. Browse our full
              menu and find something delicious.
            </p>

            <button
              type="button"
              onClick={() => navigate("/fullmenu")}
              className="mt-7 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 transition-all"
            >
              <UtensilsCrossed size={19} />
              Browse Full Menu
            </button>

          </div>
        ) : (
          <>
            {/* =========================
                CART + BILL
            ========================= */}

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">

              {/* CART ITEMS */}

              <div className="lg:col-span-2 space-y-4">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-orange-100/80 p-4 sm:p-5 hover:shadow-md transition-shadow"
                  >

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-5">

                      {/* FOOD INFO */}

                      <div className="flex gap-4 min-w-0">

                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0"
                          />
                        )}

                        <div className="min-w-0">

                          <h2 className="text-base sm:text-xl font-bold text-[#2A1810] truncate">
                            {item.name}
                          </h2>

                          <p className="text-[#9A8A7E] text-sm mt-1">
                            ₹{item.price} × {item.quantity}
                          </p>

                          <p className="text-orange-600 font-semibold mt-1 text-sm sm:text-base">
                            Subtotal: ₹
                            {item.price * item.quantity}
                          </p>

                        </div>

                      </div>

                      {/* PRICE + CONTROLS */}

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3">

                        <div className="text-xl sm:text-2xl font-bold text-[#2A1810]">
                          ₹{item.price * item.quantity}
                        </div>

                        {/* QUANTITY */}

                        <div className="flex items-center rounded-full bg-orange-50 border border-orange-100 overflow-hidden">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="w-9 h-9 flex items-center justify-center text-orange-700 hover:bg-orange-100 transition"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-8 text-center font-bold text-[#2A1810]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            aria-label={`Increase quantity of ${item.name}`}
                            className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-orange-600 to-red-500 text-white hover:brightness-110 transition"
                          >
                            <Plus size={16} />
                          </button>

                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          aria-label={`Remove ${item.name} from cart`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition font-semibold text-sm"
                        >
                          <Trash2 size={16} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

              {/* =========================
                  BILL SUMMARY (sticky on desktop)
              ========================= */}

              <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 border border-orange-100 p-6 lg:sticky lg:top-24">

                <h2 className="cart-font-display text-xl font-semibold text-[#2A1810] mb-5 flex items-center gap-2">
                  <ReceiptText size={20} className="text-orange-600" />
                  Bill Summary
                </h2>

                <div className="space-y-3 text-[#5C4A3D] text-sm">

                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="font-medium text-[#2A1810]">₹{itemsTotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-medium text-[#2A1810]">₹{gst}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <Truck size={14} />
                      Delivery Charge
                    </span>
                    <span className="font-medium text-[#2A1810]">
                      {deliveryCharge === 0
                        ? "Free"
                        : `₹${deliveryCharge}`}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-₹{discount}</span>
                    </div>
                  )}

                  <hr className="border-orange-100" />

                  <div className="flex justify-between text-lg font-bold text-[#2A1810]">
                    <span>Grand Total</span>
                    <span className="text-orange-600">₹{grandTotal}</span>
                  </div>

                </div>

                {deliveryCharge === 0 && itemsTotal > 0 && (
                  <div className="mt-4 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-center">
                    🎉 You unlocked free delivery
                  </div>
                )}

                {/* Desktop place-order button lives inside the
                    form below; this card stays focused on the
                    numbers while the mobile bar (further down)
                    carries the CTA on small screens. */}

              </div>

            </div>

            {/* =========================
                DELIVERY & PAYMENT
            ========================= */}

            <div className="mt-8 bg-white rounded-3xl shadow-lg shadow-orange-100 border border-orange-100 p-6 sm:p-8">

              <h2 className="cart-font-display text-2xl font-semibold text-[#2A1810] mb-1">
                Delivery &amp; Payment
              </h2>
              <p className="text-[#9A8A7E] text-sm mb-6">
                We'll use these details to get your order to you.
              </p>

              {/* ---------- CONTACT DETAILS ---------- */}

              <div className="mb-7">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[#8B6F52] uppercase tracking-wide mb-3">
                  <User size={15} />
                  Contact Details
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8A896]"
                    />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full border border-[#E8DDD0] pl-10 pr-3 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition text-[#2A1810] placeholder:text-[#B8A896]"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8A896]"
                    />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      autoComplete="off"
                      className="w-full border border-[#E8DDD0] pl-10 pr-3 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition text-[#2A1810] placeholder:text-[#B8A896]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="relative md:col-span-2">
                    <Phone
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8A896]"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      className="w-full border border-[#E8DDD0] pl-10 pr-3 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition text-[#2A1810] placeholder:text-[#B8A896]"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>

                </div>
              </div>

              {/* ---------- ADDRESS ---------- */}

              <div className="mb-7">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[#8B6F52] uppercase tracking-wide mb-3">
                  <MapPin size={15} />
                  Delivery Address
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="relative">
                    <Building2
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8A896]"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full border border-[#E8DDD0] pl-10 pr-3 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition text-[#2A1810] placeholder:text-[#B8A896]"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <Hash
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8A896]"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      className="w-full border border-[#E8DDD0] pl-10 pr-3 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition text-[#2A1810] placeholder:text-[#B8A896]"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>

                  <div className="relative md:col-span-2">
                    <MapPin
                      size={17}
                      className="absolute left-3.5 top-3.5 text-[#B8A896]"
                    />
                    <textarea
                      placeholder="Full Address — house/flat no., street, landmark"
                      rows={3}
                      className="w-full border border-[#E8DDD0] pl-10 pr-3 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition text-[#2A1810] placeholder:text-[#B8A896] resize-none"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                </div>
              </div>

              {/* ---------- VERIFY MOBILE (OTP) ---------- */}

              <div className="mb-7">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[#8B6F52] uppercase tracking-wide mb-3">
                  <ShieldCheck size={15} />
                  Verify Mobile Number
                </h3>

                <div className="flex flex-col sm:flex-row gap-3">

                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="flex-1 border border-[#E8DDD0] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition text-[#2A1810] placeholder:text-[#B8A896]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="flex-1 sm:flex-none bg-[#2A1810] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#1F1410] transition"
                    >
                      Send OTP
                    </button>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-orange-600 to-red-500 text-white px-5 py-3 rounded-xl font-semibold shadow-md shadow-orange-300/40 hover:-translate-y-0.5 transition-all"
                    >
                      Verify
                    </button>
                  </div>

                </div>

                {otpVerified && (
                  <p className="flex items-center gap-1.5 text-green-600 font-semibold text-sm mt-3">
                    <Check size={16} />
                    Mobile number verified
                  </p>
                )}
              </div>

              {/* ---------- PAYMENT METHOD ---------- */}

              <div className="mb-2">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[#8B6F52] uppercase tracking-wide mb-3">
                  <CreditCard size={15} />
                  Payment Method
                </h3>

                <div className="grid sm:grid-cols-3 gap-3">

                  {paymentOptions.map(({ id, label, sub, icon: Icon }) => {
                    const active = paymentMethod === id;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                          active
                            ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-400 shadow-md ring-1 ring-orange-300"
                            : "bg-white border-[#E8DDD0] hover:border-orange-300"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            active
                              ? "bg-gradient-to-br from-orange-600 to-red-500 text-white"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          <Icon size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-[#2A1810] text-sm truncate">
                            {label}
                          </p>
                          <p className="text-xs text-[#9A8A7E] truncate">
                            {sub}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                </div>

                {/* UPI */}

                {paymentMethod === "UPI" && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-5">

                    <h4 className="font-bold text-green-700 mb-3">
                      Enter UPI ID
                    </h4>

                    <input
                      type="text"
                      placeholder="example@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full border border-green-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition"
                    />

                    <p className="text-xs text-green-700/70 mt-2">
                      Example: lalit@okaxis, abc@ybl, user@ibl
                    </p>

                  </div>
                )}

                {/* CARD */}

                {paymentMethod === "CARD" && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-5">

                    <h4 className="font-bold text-blue-700 mb-3">
                      Card Details
                    </h4>

                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) =>
                        handleCardNumberChange(e.target.value)
                      }
                      className="w-full border border-blue-200 bg-white p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />

                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full border border-blue-200 bg-white p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />

                    <div className="grid grid-cols-2 gap-3">

                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) =>
                          handleExpiryChange(e.target.value)
                        }
                        className="border border-blue-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition"
                      />

                      <input
                        type="password"
                        maxLength={3}
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.replace(/\D/g, ""))
                        }
                        className="border border-blue-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition"
                      />

                    </div>

                  </div>
                )}

                {paymentMethod === "COD" && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm">
                    <p className="text-yellow-800">
                      You will pay <b>₹{grandTotal}</b> in cash when your
                      order is delivered.
                    </p>
                  </div>
                )}

              </div>

              {/* ---------- TRUST STRIP + DESKTOP CTA ---------- */}

              <div className="mt-7 pt-6 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-2 text-xs text-[#9A8A7E]">
                  <Lock size={14} className="text-green-600" />
                  Your information is encrypted and secure
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="hidden lg:inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-300/40 hover:shadow-orange-400/50 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "COD"
                    ? `Place Order — ₹${grandTotal}`
                    : `Pay ₹${grandTotal}`}
                </button>

              </div>

            </div>
          </>
        )}

      </div>

      {/* =========================================================
          MOBILE STICKY CHECKOUT BAR
          Zomato/Swiggy-style persistent bar on small screens so
          the CTA is always reachable without scrolling back up.
      ========================================================= */}

      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-orange-100 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#9A8A7E]">Grand Total</p>
              <p className="text-lg font-extrabold text-[#2A1810]">
                ₹{grandTotal}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="flex-1 max-w-[220px] flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-300/40 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading
                ? "Processing..."
                : paymentMethod === "COD"
                ? "Place Order"
                : "Pay Now"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default CartPage;