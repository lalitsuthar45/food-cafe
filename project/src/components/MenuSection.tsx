import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
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
  Search,
  ArrowRight,
} from "lucide-react";
import type { CartItem, FoodItem } from "./FullMenu";
import { fullMenuItems } from "./FullMenu";
import { getAuthHeaders, getAuthUser } from "./authStorage";
import { useToast } from "./Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pythonfastapi-production-f08a.up.railway.app";

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
  const navigate = useNavigate();
  const appToast = useToast();
  const [activeCategory, setActiveCategory] = useState("starters");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

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

  // Search na ho to activeCategory ke items dikhte hain
  const displayedItems: MenuItem[] = menuItems[activeCategory];

  // =========================================================
  // SEARCH + DISPLAYED ITEMS
  // Search box typed hone par Full Menu ke POORE catalog (105+
  // items) mein se dhoondte hain, na ki sirf home page ke
  // chhote menu mein — kyunki user zyadatar dishes Full Menu
  // page mein hi milti hain.
  // =========================================================

  const searchResults: FoodItem[] =
    search.trim().length > 0
      ? fullMenuItems.filter(
          (item) =>
            item.name
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            item.category
              .toLowerCase()
              .includes(search.trim().toLowerCase())
        )
      : [];

  const isSearching = search.trim().length > 0;

  const getCategoryThumb = (categoryId: string) => {
    const firstItem = menuItems[categoryId]?.[0];
    return firstItem ? firstItem.image : "";
  };

  // =========================================================
  // SEARCH RESULT: CART + FAVORITE HELPERS
  // Full Menu ke items "fullmenu-" prefix use karte hain
  // (jaisa FullMenu.tsx aur favorites mein already hai), taaki
  // home page ke apne items (id 1-16) se overlap na ho.
  // =========================================================

  const getSearchItemCartQuantity = (id: number) => {
    const cartItem = cartItems.find((ci) => ci.id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const addSearchItemToCart = (item: FoodItem) => {
    setCartItems((prevCartItems) => {
      const existing = prevCartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existing) {
        return prevCartItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
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
          quantity: 1,
        },
      ];
    });

    showToast(`${item.name} added to cart`);
  };

  const increaseSearchItemQuantity = (item: FoodItem) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const decreaseSearchItemQuantity = (id: number) => {
    setCartItems((prevCartItems) =>
      prevCartItems
        .map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  const openSearchItemDetail = (item: FoodItem) => {
    navigate(`/food/fullmenu-${item.id}`, {
      state: {
        item: {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
        },
      },
    });
  };

  // =========================================================
  // OPEN FOOD DETAIL PAGE
  // =========================================================

  const openFoodDetail = (item: MenuItem) => {
    navigate(`/food/menu-${item.id}`, {
      state: {
        item: {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          rating: item.rating,
          tag: item.tag,
        },
      },
    });
  };

  const getCartQuantity = (id: number) => {
    const cartItem = cartItems.find((ci) => ci.id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  // =========================================================
  // FAVORITES
  // "menu-" prefix isliye taaki Home page ke item IDs aur
  // FullMenu page ke item IDs aapas mein overlap na karein.
  // =========================================================

  const [favoriteKeys, setFavoriteKeys] = useState<string[]>([]);
  useEffect(() => {
    const user = getAuthUser();

    if (!user.email) return;

    fetch(
      `${API_URL}/favorites/${encodeURIComponent(user.email)}`,
      { headers: getAuthHeaders() }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavoriteKeys(
            data.map((favorite: { food_key: string }) => favorite.food_key)
          );
        }
      })
      .catch(() => {});
  }, []);

  const toggleFavorite = async (item: MenuItem) => {
    const user = getAuthUser();

    if (!user.email) {
      appToast.warning("Please login to save favorites");
      return;
    }

    const foodKey = `menu-${item.id}`;
    const isFavorited = favoriteKeys.includes(foodKey);

    try {
      if (isFavorited) {
        const response = await fetch(
          `${API_URL}/favorites/${encodeURIComponent(foodKey)}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );

        if (response.ok) {
          setFavoriteKeys((prev) =>
            prev.filter((key) => key !== foodKey)
          );
          appToast.info("Removed from favorites");
        }
      } else {
        const response = await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            user_email: user.email,
            food_key: foodKey,
            food_name: item.name,
            price: item.price,
            image: item.image,
          }),
        });

        if (response.ok) {
          setFavoriteKeys((prev) => [...prev, foodKey]);
          appToast.success("Added to favorites");
        }
      }
    } catch {
      appToast.error("Unable to update favorites");
    }
  };

  const handleAddClick = (item: MenuItem) => {
    setCartItems((prevCartItems) => {
      const existing = prevCartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existing) {
        return prevCartItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
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
          quantity: 1,
        },
      ];
    });

    showToast(`${item.name} added to cart`);
  };

  const increaseCartQuantity = (item: MenuItem) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const decreaseCartQuantity = (id: number) => {
    setCartItems((prevCartItems) =>
      prevCartItems
        .map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  return (
    <section
      id="menu"
      className="relative py-16 sm:py-24 bg-[#FFF8F0] overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');
        .menu-font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      `}</style>

      {/* =========================================================
          SUCCESS TOAST
          Portal se seedha document.body mein render kiya, taaki
          Home page ke <main> wale transform (translate-x-0 /
          translate-x-64) aur is section ke overflow-hidden se
          toast clip/hide na ho. FullMenu page pe koi transformed
          parent nahi hai isliye wahan ye problem nahi thi.
      ========================================================= */}
      {toast &&
        createPortal(
          <div className="toast-success">{toast}</div>,
          document.body
        )}

      <div className="pointer-events-none absolute top-10 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-72 h-72 bg-red-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-12">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase mb-4">
            <Flame size={14} />
            Popular Indian Dishes
          </div>

          <h2 className="menu-font-display text-3xl sm:text-5xl text-[#2A1810] mb-3">
            Our{" "}
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
              Indian Menu
            </span>
          </h2>

          <p className="text-[#7A6A5E] text-base sm:text-lg">
            Taste the authentic flavors of India 🇮🇳
          </p>

        </div>

        {/* SEARCH BAR */}
        <div className="max-w-xl mx-auto mb-10 sm:mb-12">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for dishes..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-orange-100 bg-white text-[#2A1810] placeholder:text-[#9A8A7E] outline-none focus:ring-2 focus:ring-orange-300 shadow-sm transition"
            />
          </div>
        </div>

        {/* CATEGORIES — circular tiles, Domino's style */}
        {search.trim().length === 0 && (
          <div className="mb-10 sm:mb-12">

            <p className="text-center text-[#9A8A7E] font-semibold mb-6">
              What are you craving for?
            </p>

            <div className="flex justify-center flex-wrap gap-6 sm:gap-10">

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex flex-col items-center gap-2.5 group"
                >
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden transition-all duration-300 ${
                      activeCategory === category.id
                        ? "ring-4 ring-orange-500 shadow-lg shadow-orange-200 scale-105"
                        : "ring-2 ring-white shadow-md group-hover:scale-105 group-hover:shadow-orange-200/60"
                    }`}
                  >
                    <img
                      src={getCategoryThumb(category.id)}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span
                    className={`menu-font-display text-sm sm:text-base ${
                      activeCategory === category.id
                        ? "text-orange-600"
                        : "text-[#5C4A3D]"
                    }`}
                  >
                    {category.name}
                  </span>
                </button>
              ))}

            </div>
          </div>
        )}

        {/* FOOD GRID */}
        {isSearching ? (

          /* =====================================================
             SEARCH RESULTS — Full Menu ke poore catalog se
          ===================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">

            {searchResults.length === 0 && (
              <p className="col-span-full text-center text-[#9A8A7E] py-10">
                No dishes matched "{search}".
              </p>
            )}

            {searchResults.map((item) => (

              <div
                key={`search-${item.id}`}
                onClick={() => openSearchItemDetail(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") openSearchItemDetail(item);
                }}
                className="group bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >

                {/* IMAGE */}
                <div className="relative h-48 sm:h-52 overflow-hidden">

                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow">
                    {item.category}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image: item.image,
                        rating: 0,
                        tag: item.category,
                      });
                    }}
                    aria-label={
                      favoriteKeys.includes(`menu-${item.id}`)
                        ? `Remove ${item.name} from favorites`
                        : `Add ${item.name} to favorites`
                    }
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition"
                  >
                    <Heart
                      size={18}
                      className="text-red-500"
                      fill={
                        favoriteKeys.includes(`fullmenu-${item.id}`)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="menu-font-display text-lg sm:text-xl text-[#2A1810]">
                      {item.name}
                    </h3>

                    <span className="font-extrabold text-orange-600 whitespace-nowrap">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="text-sm text-[#7A6A5E] mb-5 min-h-[40px] line-clamp-2">
                    {item.description}
                  </p>

                  {/* ADD / QUANTITY */}
                  <div className="flex items-center gap-2">

                    {getSearchItemCartQuantity(item.id) === 0 ? (

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addSearchItemToCart(item);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white py-3 rounded-2xl font-bold shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 transition-all"
                      >
                        <ShoppingCart size={18} />
                        Add
                      </button>

                    ) : (

                      <div className="w-full flex items-center justify-between rounded-2xl bg-orange-50 border border-orange-100 overflow-hidden">

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            decreaseSearchItemQuantity(item.id);
                          }}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-12 h-12 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="font-bold text-[#2A1810]">
                          {getSearchItemCartQuantity(item.id)}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            increaseSearchItemQuantity(item);
                          }}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-12 h-12 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition"
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          /* =====================================================
             ACTIVE CATEGORY (default browse view)
          ===================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">

          {displayedItems.length === 0 && (
            <p className="col-span-full text-center text-[#9A8A7E] py-10">
              No dishes matched "{search}".
            </p>
          )}

          {displayedItems.map((item) => (

            <div
              key={item.id}
              onClick={() => openFoodDetail(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") openFoodDetail(item);
              }}
              className="group bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >

              {/* IMAGE */}
              <div className="relative h-48 sm:h-52 overflow-hidden">

                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow">
                  {item.tag}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item);
                  }}
                  aria-label={
                    favoriteKeys.includes(`menu-${item.id}`)
                      ? `Remove ${item.name} from favorites`
                      : `Add ${item.name} to favorites`
                  }
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition"
                >
                  <Heart
                    size={18}
                    className="text-red-500"
                    fill={
                      favoriteKeys.includes(`menu-${item.id}`)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>

              </div>

              {/* CONTENT */}
              <div className="p-5">

                <div className="flex items-start justify-between gap-3 mb-2">

                  <h3 className="menu-font-display text-lg sm:text-xl text-[#2A1810]">
                    {item.name}
                  </h3>

                  <span className="font-extrabold text-orange-600 whitespace-nowrap">
                    ₹{item.price}
                  </span>

                </div>

                <p className="text-sm text-[#7A6A5E] mb-4 min-h-[40px]">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-5">

                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star
                      size={16}
                      className="fill-amber-500"
                    />
                    {item.rating}
                  </div>

                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                    Veg
                  </span>

                </div>

                {/* QUANTITY / ADD (Add button becomes a stepper once item is in cart) */}
                <div className="flex items-center gap-2">

                  {getCartQuantity(item.id) === 0 ? (

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddClick(item);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white py-3 rounded-2xl font-bold shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 transition-all"
                    >
                      <ShoppingCart size={18} />
                      Add
                    </button>

                  ) : (

                    <div className="w-full flex items-center justify-between rounded-2xl bg-orange-50 border border-orange-100 overflow-hidden">

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseCartQuantity(item.id);
                        }}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="w-12 h-12 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="font-bold text-[#2A1810]">
                        {getCartQuantity(item.id)}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseCartQuantity(item);
                        }}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="w-12 h-12 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition"
                      >
                        <Plus size={16} />
                      </button>

                    </div>

                  )}

                </div>

              </div>

            </div>

          ))}

          </div>

        )}

        {/* FULL MENU BUTTON */}
        <div className="text-center mt-14">

          <button
            onClick={() =>
              (window.location.href = "/fullmenu")
            }
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-orange-200 bg-white text-orange-700 font-bold shadow-sm hover:bg-orange-50 hover:shadow-md transition-all"
          >
            View Full Menu
            <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          </button>

        </div>

      </div>
    </section>
  );
}