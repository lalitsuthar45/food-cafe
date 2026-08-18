import { ChefHat, Star, Clock, Truck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950 flex items-center pt-20"
    >
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-300/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-300/40 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="text-center lg:text-left page-transition">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow mb-6 text-orange-700 dark:text-orange-300 font-semibold">
            <ChefHat size={20} />
            Premium Food Experience
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            Delicious Food,
            <br />
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
              Delivered Fresh
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Experience fresh ingredients, authentic flavors, fast delivery and
            premium dining at Savory Haven.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => navigate("/fullmenu")}
              className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-orange-300/50 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              View Menu
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition"
              />
            </button>

            <button
              onClick={() => navigate("/reservation")}
              className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-orange-600 dark:text-orange-300 rounded-2xl font-bold shadow-xl border border-orange-200 dark:border-slate-700 hover:-translate-y-1 transition-all"
            >
              Reserve a Table
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="glass-card hover-lift rounded-2xl p-4 text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-orange-600">
                15+
              </div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                Years
              </p>
            </div>

            <div className="glass-card hover-lift rounded-2xl p-4 text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-orange-600">
                50+
              </div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                Menu Items
              </p>
            </div>

            <div className="glass-card hover-lift rounded-2xl p-4 text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-orange-600">
                10k+
              </div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                Customers
              </p>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative w-full max-w-xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl opacity-30" />

            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
              alt="Delicious healthy food bowl"
              loading="eager"
              className="relative z-10 w-full h-[520px] object-cover rounded-[3rem] shadow-2xl hover:scale-[1.02] transition duration-500"
            />

            <div className="absolute top-8 -left-8 z-20 glass-card rounded-2xl p-4 flex items-center gap-3 animate-bounce">
              <div className="w-11 h-11 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="text-yellow-500 fill-yellow-500" size={22} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">4.9</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Rating
                </p>
              </div>
            </div>

            <div className="absolute bottom-10 -right-8 z-20 glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="text-orange-600" size={22} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  30 min
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Delivery
                </p>
              </div>
            </div>

            <div className="absolute top-1/2 -right-10 z-20 glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                <Truck className="text-green-600" size={22} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Free</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center text-gray-500 dark:text-gray-300">
        <span className="text-xs mb-2">Scroll Down</span>
        <div className="w-6 h-10 border-2 border-orange-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}