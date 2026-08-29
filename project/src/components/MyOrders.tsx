import { useEffect, useState } from "react";

type OrderItem = {
  food_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: number;
  user_email?: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  payment_method: string;
  items_total: number;
  gst: number;
  delivery_charge: number;
  discount: number;
  grand_total: number;
  status: string;
  items: OrderItem[];
};

function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState<number | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getApiUrl = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://10.44.113.252:8000";
  }

  return import.meta.env.VITE_API_URL;
};

  const fetchOrders = async () => {
    if (!user.email) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${getApiUrl()}/orders/${encodeURIComponent(user.email)}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Orders load nahi ho rahe");
        setOrders([]);
        return;
      }

      const safeOrders = Array.isArray(data) ? data : [];

      const onlyMyOrders = safeOrders.filter((order: Order) => {
        if (!order.user_email) return true;

        return order.user_email === user.email;
      });

      setOrders(onlyMyOrders);
    } catch {
      alert("Orders load nahi ho rahe");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user.email]);

  const cancelOrder = async (orderId: number) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    setCancelLoadingId(orderId);

    try {
      const response = await fetch(
        `${getApiUrl()}/orders/${orderId}/cancel`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Order cancel nahi ho paaya");
        return;
      }

      alert(data.message || "Order cancelled successfully");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: "Cancelled" }
            : order
        )
      );
    } catch {
      alert("Backend server not running");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const canCancelOrder = (status: string) => {
    return status === "Pending";
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Preparing":
        return "bg-orange-100 text-orange-700";

      case "Out For Delivery":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "Pending":
        return "Your order has been received.";

      case "Confirmed":
        return "Your order has been confirmed by the restaurant.";

      case "Preparing":
        return "Your food is being prepared.";

      case "Out For Delivery":
        return "Your order is on the way.";

      case "Delivered":
        return "Your order has been delivered.";

      case "Cancelled":
        return "This order has been cancelled.";

      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 text-center text-xl font-semibold">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pt-28 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <h2 className="text-2xl font-bold">
              No orders found
            </h2>

            <p className="text-gray-500 mt-2">
              Aapne abhi tak koi order nahi kiya.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Order #{order.id}
                    </h2>

                    <p className="text-gray-500">
                      Payment: {order.payment_method}
                    </p>

                    {order.user_email && (
                      <p className="text-gray-400 text-sm">
                        {order.user_email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3">
                    <span
                      className={`${getStatusClass(
                        order.status
                      )} px-4 py-2 rounded-full font-semibold`}
                    >
                      {order.status}
                    </span>

                    <p className="text-sm text-gray-500 max-w-xs md:text-right">
                      {getStatusMessage(order.status)}
                    </p>

                    {canCancelOrder(order.status) && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={cancelLoadingId === order.id}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-60"
                      >
                        {cancelLoadingId === order.id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between gap-1">
                    {[
                      "Pending",
                      "Confirmed",
                      "Preparing",
                      "Out For Delivery",
                      "Delivered",
                    ].map((status, index) => {
                      const statuses = [
                        "Pending",
                        "Confirmed",
                        "Preparing",
                        "Out For Delivery",
                        "Delivered",
                      ];

                      const currentIndex = statuses.indexOf(
                        order.status
                      );

                      const isCompleted =
                        currentIndex >= index &&
                        order.status !== "Cancelled";

                      const isCurrent =
                        order.status === status;

                      return (
                        <div
                          key={status}
                          className="flex flex-1 items-center"
                        >
                          <div className="flex flex-col items-center w-full">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                isCompleted
                                  ? "bg-orange-600 text-white"
                                  : "bg-gray-200 text-gray-500"
                              } ${
                                isCurrent
                                  ? "ring-4 ring-orange-100"
                                  : ""
                              }`}
                            >
                              {isCompleted ? "✓" : index + 1}
                            </div>

                            <span className="text-[10px] sm:text-xs text-gray-500 text-center mt-2">
                              {status}
                            </span>
                          </div>

                          {index < 4 && (
                            <div
                              className={`h-1 flex-1 rounded ${
                                currentIndex > index &&
                                order.status !== "Cancelled"
                                  ? "bg-orange-600"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {order.status === "Cancelled" && (
                  <div className="mt-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                    This order has been cancelled.
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-2"
                    >
                      <span>
                        {item.food_name} × {item.quantity}
                      </span>

                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span>₹{order.items_total}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST</span>
                    <span>₹{order.gst}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>₹{order.delivery_charge}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-xl font-bold text-orange-600">
                    <span>Grand Total</span>
                    <span>₹{order.grand_total}</span>
                  </div>
                </div>

                <div className="mt-5 bg-orange-50 p-4 rounded-xl">
                  <h3 className="font-bold text-orange-700">
                    Delivery Address
                  </h3>

                  <p className="text-gray-700 mt-1">
                    {order.customer_name}, {order.phone}
                    <br />
                    {order.address}, {order.city} - {order.pincode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
