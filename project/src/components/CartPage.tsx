import { useState } from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartPageProps = {
  cartItems: CartItem[];
};

type PaymentMethod = "COD" | "UPI" | "CARD";

function CartPage({ cartItems }: CartPageProps) {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [upiId, setUpiId] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const gst = Math.round(itemsTotal * 0.05);
  const deliveryCharge = itemsTotal > 499 || itemsTotal === 0 ? 0 : 40;
  const discount = itemsTotal > 999 ? 100 : 0;
  const grandTotal = itemsTotal + gst + deliveryCharge - discount;

  const getApiUrl = () => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://10.44.113.252:8000";
    }

    return `http://${window.location.hostname}:8000`;
  };

  const handleCardNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
    const formatted = digitsOnly.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4);

    if (digitsOnly.length >= 3) {
      setExpiry(`${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`);
    } else {
      setExpiry(digitsOnly);
    }
  };

  const isValidUpi = (value: string) => {
    return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(value);
  };

  const handleSendOtp = () => {
    if (!mobile || mobile.length < 10) {
      alert("Please enter valid mobile number");
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpVerified(false);
    alert("Demo OTP: " + randomOtp);
  };

  const handleVerifyOtp = () => {
    if (!generatedOtp) {
      alert("Please send OTP first");
      return;
    }

    if (otp === generatedOtp) {
      setOtpVerified(true);
      alert("OTP verified successfully");
    } else {
      setOtpVerified(false);
      alert("Invalid OTP");
    }
  };

  const validatePayment = () => {
    if (paymentMethod === "COD") return true;

    if (paymentMethod === "UPI") {
      if (!upiId) {
        alert("Please enter UPI ID");
        return false;
      }

      if (!isValidUpi(upiId)) {
        alert("Please enter valid UPI ID. Example: lalit@okaxis");
        return false;
      }

      return true;
    }

    if (paymentMethod === "CARD") {
      const cleanCard = cardNumber.replace(/\s/g, "");

      if (!cleanCard || cleanCard.length !== 16) {
        alert("Please enter valid 16 digit card number");
        return false;
      }

      if (!cardHolder) {
        alert("Please enter card holder name");
        return false;
      }

      if (!expiry || expiry.length !== 5) {
        alert("Please enter valid expiry date MM/YY");
        return false;
      }

      if (!cvv || cvv.length < 3) {
        alert("Please enter valid CVV");
        return false;
      }

      return true;
    }

    return false;
  };


    const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!fullName || !address || !city || !pincode || !mobile) {
      alert("Please fill all delivery details");
      return;
    }

    if (!otpVerified) {
      alert("Please verify OTP first");
      return;
    }

    if (!validatePayment()) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.email) {
      alert("User not found. Please login again.");
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    const orderData = {
      user_email: user.email,
      customer_name: fullName,
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
      const response = await fetch(`${getApiUrl()}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Order failed");
        return;
      }

      alert(
        `Order placed successfully!\nOrder ID: ${data.order_id}\nAmount: ₹${data.grand_total}`
      );
    } catch {
      alert("Backend server not running");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-8">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mt-2">
              Add delicious food items to continue.
            </p>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {item.name}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        ₹{item.price} × {item.quantity}
                      </p>
                      <p className="text-orange-600 font-semibold mt-1">
                        Subtotal: ₹{item.price * item.quantity}
                      </p>
                    </div>

                    <div className="text-2xl font-bold text-gray-800">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                  Bill Summary
                </h2>

                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span>₹{itemsTotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>
                      {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-xl font-bold text-orange-600">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-orange-600">
                Delivery & Payment Details
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="City"
                  className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />

                <textarea
                  placeholder="Full Address"
                  className="md:col-span-2 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <div className="md:col-span-2 flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="flex-1 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
                  >
                    Send OTP
                  </button>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700"
                  >
                    Verify OTP
                  </button>
                </div>

                {otpVerified && (
                  <p className="md:col-span-2 text-green-600 font-semibold">
                    OTP verified successfully ✅
                  </p>
                )}
                                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-700 text-lg">
                    Payment Method
                  </label>

                  <div className="grid md:grid-cols-3 gap-4 mt-3">
                    {["COD", "UPI", "CARD"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          setPaymentMethod(method as PaymentMethod)
                        }
                        className={`p-4 rounded-xl border font-semibold transition-all ${
                          paymentMethod === method
                            ? "bg-orange-600 text-white border-orange-600 shadow-lg"
                            : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
                        }`}
                      >
                        {method === "COD"
                          ? "Cash on Delivery"
                          : method === "UPI"
                          ? "UPI Payment"
                          : "Debit / Credit Card"}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === "UPI" && (
                  <div className="md:col-span-2 bg-green-50 border border-green-300 rounded-xl p-5">
                    <h3 className="font-bold text-lg text-green-700 mb-4">
                      UPI Payment
                    </h3>

                    <input
                      type="text"
                      placeholder="Enter UPI ID (example@okaxis)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <p className="text-sm text-gray-500 mt-2">
                      Example:
                      lalit@okaxis,
                      abc@ybl,
                      user@ibl
                    </p>
                  </div>
                )}

                {paymentMethod === "CARD" && (
                  <div className="md:col-span-2 bg-blue-50 border border-blue-300 rounded-xl p-5">

                    <h3 className="font-bold text-lg text-blue-700 mb-4">
                      Debit / Credit Card
                    </h3>

                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) =>
                        handleCardNumberChange(e.target.value)
                      }
                      className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="grid grid-cols-2 gap-4">

                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) =>
                          handleExpiryChange(e.target.value)
                        }
                        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <input
                        type="password"
                        maxLength={3}
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                  </div>
                )}
                                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="md:col-span-2 w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl text-lg font-bold transition disabled:opacity-60"
                >
                  {loading
                    ? "Processing Payment..."
                    : paymentMethod === "COD"
                    ? `Place Order ₹${grandTotal}`
                    : `Pay ₹${grandTotal}`}
                </button>

                {paymentMethod === "COD" && (
                  <div className="md:col-span-2 bg-yellow-50 border border-yellow-300 rounded-xl p-4">
                    <h3 className="font-bold text-yellow-700">
                      Cash On Delivery
                    </h3>

                    <p className="text-gray-600 mt-2">
                      You will pay <b>₹{grandTotal}</b> when your order is
                      delivered.
                    </p>
                  </div>
                )}

                {paymentMethod === "UPI" && (
                  <div className="md:col-span-2 bg-green-50 border border-green-300 rounded-xl p-4">
                    <h3 className="font-bold text-green-700">
                      UPI Payment
                    </h3>

                    <p className="text-gray-600 mt-2">
                      Your payment will be processed securely through your UPI
                      application.
                    </p>
                  </div>
                )}

                {paymentMethod === "CARD" && (
                  <div className="md:col-span-2 bg-blue-50 border border-blue-300 rounded-xl p-4">
                    <h3 className="font-bold text-blue-700">
                      Secure Card Payment
                    </h3>

                    <p className="text-gray-600 mt-2">
                      Your card details are encrypted. Only the last 4 digits
                      are stored with the order for reference.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;