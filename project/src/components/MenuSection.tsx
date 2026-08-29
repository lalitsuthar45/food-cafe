
import { useState } from "react";
import {
  Coffee,
  UtensilsCrossed,
  Cake,
  Wine,
  Star,
  ShoppingCart,
  Heart,
  Flame,
  Minus,
  Plus,
} from "lucide-react";
import type { CartItem } from "./FullMenu";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  tag: string;
}

interface Props {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function MenuSection({
  cartItems,
  setCartItems,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("starters");
  const [toast, setToast] = useState("");
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const categories = [
    {
      id: "starters",
      name: "Starters",
      icon: UtensilsCrossed,
    },
    {
      id: "maincourse",
      name: "Main Course",
      icon: Coffee,
    },
    {
      id: "desserts",
      name: "Desserts",
      icon: Cake,
    },
    {
      id: "drinks",
      name: "Drinks",
      icon: Wine,
    },
  ];

  const menuItems: Record<string, MenuItem[]> = {
    starters: [
      {
        id: 1,
        name: "Burger",
        description: "Juicy patty in soft bun",
        price: 299,
        rating: 4.8,
        tag: "Best Seller",
        image:
          "https://insanelygoodrecipes.com/wp-content/uploads/2020/10/Hamburger-with-Fresh-Vegetables.png",
      },
      {
        id: 2,
        name: "Pizza",
        description: "Cheesy crispy topped delight",
        price: 249,
        rating: 4.7,
        tag: "Hot",
        image:
          "https://i.pinimg.com/736x/95/9d/07/959d075f1d43263e53f1bbff0dee4baf.jpg",
      },
      {
        id: 3,
        name: "Noodles",
        description: "Saucy spicy stir-fried strands",
        price: 349,
        rating: 4.6,
        tag: "Popular",
        image:
          "https://i.pinimg.com/736x/f9/8c/0e/f98c0e31d5b512767447af7b1d35ac61.jpg",
      },
      {
        id: 4,
        name: "Pav Bhaji",
        description: "Buttery spicy mashed vegetables",
        price: 229,
        rating: 4.9,
        tag: "New",
        image:
          "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=500",
      },
    ],

    maincourse: [
      {
        id: 5,
        name: "Veg Biryani",
        description: "Aromatic spiced rice with vegetables",
        price: 399,
        rating: 4.9,
        tag: "Best Seller",
        image:
          "https://i.pinimg.com/736x/2d/23/83/2d238302ba93305b76ce9017de063cab.jpg",
      },
      {
        id: 6,
        name: "Shahi Paneer",
        description: "Rich creamy paneer with roti",
        price: 349,
        rating: 4.8,
        tag: "Premium",
        image:
          "https://i.pinimg.com/736x/2e/f7/57/2ef757a94d658cc1b58ca352630debf6.jpg",
      },
      {
        id: 7,
        name: "Dal Bati",
        description: "Smoky lentils with baked wheat balls",
        price: 279,
        rating: 4.7,
        tag: "Rajasthani",
        image:
          "https://i.pinimg.com/736x/96/ab/cb/96abcbb605d6bb0f3e20c58afe9cb96a.jpg",
      },
      {
        id: 8,
        name: "Chole Bhature",
        description: "Spicy chickpeas with fluffy bread",
        price: 299,
        rating: 4.6,
        tag: "Popular",
        image:
          "https://i.pinimg.com/736x/37/5d/3b/375d3b1b6159172160c7bdbcdaffcbbe.jpg",
      },
    ],

    desserts: [
      {
        id: 9,
        name: "Gulab Jamun",
        description: "Milk-solid balls in sugar syrup",
        price: 149,
        rating: 4.9,
        tag: "Sweet",
        image:
          "https://i.pinimg.com/736x/d7/57/aa/d757aaadf9cb57a72ee0143984c7338b.jpg",
      },
      {
        id: 10,
        name: "Kheer",
        description: "Creamy rice pudding with nuts",
        price: 139,
        rating: 4.7,
        tag: "Classic",
        image:
          "https://i.pinimg.com/1200x/a1/12/02/a11202077fa9c8beee302a94cb62160b.jpg",
      },
      {
        id: 11,
        name: "Ras Malai",
        description: "Soft paneer discs in saffron milk",
        price: 139,
        rating: 4.8,
        tag: "Premium",
        image:
          "https://i.pinimg.com/736x/eb/f2/22/ebf222edc23a0f2414cbb2050bf67ee6.jpg",
      },
      {
        id: 12,
        name: "Rasgulla",
        description: "Spongy cottage cheese balls",
        price: 139,
        rating: 4.6,
        tag: "Soft",
        image:
          "https://i.pinimg.com/736x/31/fb/61/31fb61d23d041061c567d304d80b36b2.jpg",
      },
    ],

    drinks: [
      {
        id: 13,
        name: "Mango Juice",
        description: "Sweet mango drink",
        price: 99,
        rating: 4.8,
        tag: "Fresh",
        image:
          "https://i.pinimg.com/736x/ee/a6/f7/eea6f79fe565f6eec6ba355d794c3d97.jpg",
      },
      {
        id: 14,
        name: "Lassi",
        description: "Traditional yogurt drink",
        price: 49,
        rating: 4.9,
        tag: "Cool",
        image:
          "https://i.pinimg.com/736x/ac/29/6b/ac296bc007f7d3f127daed3b0a181a38.jpg",
      },
      {
        id: 15,
        name: "Masala Chai",
        description: "Indian spiced tea",
        price: 49,
        rating: 4.7,
        tag: "Hot",
        image:
          "https://i.pinimg.com/736x/19/be/10/19be10b3f34cad7a6f7434eb3d7c5135.jpg",
      },
      {
        id: 16,
        name: "Chaas",
        description: "Traditional buttermilk",
        price: 49,
        rating: 4.6,
        tag: "Healthy",
        image:
          "https://i.pinimg.com/1200x/93/ea/a4/93eaa4bdc21f9bacbaae17269b697199.jpg",
      },
    ],
  };

  const showToast = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 1800);
  };

  const getQuantity = (id: number) => {
    return quantities[id] || 1;
  };

  const increaseQuantity = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min((prev[id] || 1) + 1, 20),
    }));
  };

  const decreaseQuantity = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));
  };

  const handleAddClick = (item: MenuItem) => {
    const quantity = getQuantity(item.id);

    setCartItems((prevCartItems) => {
      const existing = prevCartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existing) {
        return prevCartItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + quantity,
                image: item.image,
              }
            : cartItem
        );
      }

      return [
        ...prevCartItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity,
        },
      ];
    });

    showToast(
      `${quantity} × ${item.name} added to cart`
    );

    // Add hone ke baad quantity dobara 1 se start hogi
    setQuantities((prev) => ({
      ...prev,
      [item.id]: 1,
    }));
  };

  return (
    <section
      id="menu"
      className="relative py-24 bg-gradient-to-br from-white via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950 overflow-hidden"
    >
      {/* SUCCESS TOAST */}
      {toast && (
        <div className="toast-success">
          {toast}
        </div>
      )}

      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl" />

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-slate-800/70 shadow text-orange-700 dark:text-orange-300 font-semibold mb-5">
            <Flame size={18} />
            Popular Indian Dishes
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
              Indian Menu
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Taste the authentic flavors of India 🇮🇳
          </p>

        </div>

        {/* CATEGORIES */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">

          {categories.map((category) => {

            const Icon = category.icon;

            return (
              <button
                key={category.id}
                onClick={() =>
                  setActiveCategory(category.id)
                }
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-xl scale-105"
                    : "bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-slate-700 shadow"
                }`}
              >
                <Icon size={20} />
                {category.name}
              </button>
            );
          })}

        </div>

        {/* FOOD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {menuItems[activeCategory].map((item) => (

            <div
              key={item.id}
              className="group glass-card hover-lift rounded-3xl overflow-hidden"
            >

              {/* IMAGE */}
              <div className="relative h-52 overflow-hidden">

                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow">
                  {item.tag}
                </div>

                <button
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow hover:scale-110 transition"
                >
                  <Heart
                    size={18}
                    className="text-red-500"
                  />
                </button>

              </div>

              {/* CONTENT */}
              <div className="p-5">

                <div className="flex items-start justify-between gap-3 mb-2">

                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>

                  <span className="text-xl font-extrabold text-orange-600">
                    ₹{item.price}
                  </span>

                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 min-h-[40px]">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-5">

                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star
                      size={17}
                      className="fill-yellow-500"
                    />
                    {item.rating}
                  </div>

                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                    Veg
                  </span>

                </div>

                {/* QUANTITY + ADD */}
                <div className="flex items-center gap-2">

                  <div className="flex items-center rounded-2xl bg-orange-50 dark:bg-slate-800 border border-orange-100 dark:border-slate-700">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      className="w-10 h-10 flex items-center justify-center text-orange-600 hover:bg-orange-100 dark:hover:bg-slate-700 rounded-l-2xl transition"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-8 text-center font-bold text-gray-900 dark:text-white">
                      {getQuantity(item.id)}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      className="w-10 h-10 flex items-center justify-center text-orange-600 hover:bg-orange-100 dark:hover:bg-slate-700 rounded-r-2xl transition"
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleAddClick(item)
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white py-3 rounded-2xl font-bold shadow-lg hover:shadow-orange-300/50 hover:-translate-y-1 transition-all"
                  >
                    <ShoppingCart size={18} />
                    Add
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* FULL MENU BUTTON */}
        <div className="text-center mt-14">

          <button
            onClick={() =>
              (window.location.href = "/fullmenu")
            }
            className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-300 font-bold shadow-xl hover:-translate-y-1 transition"
          >
            View Full Menu
          </button>

        </div>

      </div>
    </section>
  );
}
