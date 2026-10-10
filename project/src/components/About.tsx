import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Clock,
  Sparkles,
  ChefHat,
  Star,
  ShieldCheck,
  Flame,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"story" | "mission" | "promise">("story");

  const features = [
    {
      icon: Award,
      badge: "Quality First",
      title: "Handpicked Ingredients",
      description: "Directly sourced from trusted local organic farms and artisanal spice masters.",
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: ChefHat,
      badge: "Culinary Art",
      title: "Master Chef Creations",
      description: "Every recipe is perfected through decades of gourmet tradition and passion.",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Flame,
      badge: "Authentic Fire",
      title: "Wood-Fired & Slow Cooked",
      description: "Authentic clay ovens and wood-fired hearths that seal in original aromas.",
      color: "from-amber-500 to-red-500",
    },
    {
      icon: Clock,
      badge: "Always Fresh",
      title: "Crafted to Order",
      description: "Never pre-packaged or frozen. Prepared fresh from scratch every single day.",
      color: "from-orange-600 to-yellow-500",
    },
  ];

  const highlights = [
    "100% Fresh & Chemical-Free Produce",
    "Hygienic 5-Star Kitchen Standards",
    "Artisanal Handcrafted Sauces & Dough",
    "Eco-Friendly Sustainable Packaging",
  ];

  return (
    <section
      id="about"
      className="relative py-24 bg-gradient-to-b from-orange-50/50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-red-300/20 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative & Stats */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-sm font-semibold tracking-wide">
              <Sparkles size={16} className="text-orange-500" />
              The Savory Haven Story
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.15]">
              Where Passion Meets{" "}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-500 bg-clip-text text-transparent">
                Exceptional Taste
              </span>
            </h2>

            {/* Interactive Narrative Tabs */}
            <div className="flex gap-2 p-1.5 bg-orange-100/70 dark:bg-slate-800/80 rounded-2xl w-fit border border-orange-200/60 dark:border-slate-700">
              {(
                [
                  { id: "story", label: "Our Story" },
                  { id: "mission", label: "Our Philosophy" },
                  { id: "promise", label: "Our Promise" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dynamic Content based on selected tab */}
            <div className="min-h-[110px] text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              {activeTab === "story" && (
                <p>
                  Established in 2009, <strong>Savory Haven</strong> began with a humble dream:
                  to celebrate the joy of comfort food elevated with gourmet craft. Over the past 15
                  years, we've transformed traditional heritage recipes into extraordinary dining
                  moments that bring families, friends, and food lovers together.
                </p>
              )}
              {activeTab === "mission" && (
                <p>
                  We believe dining should be an emotional experience, not just a meal. Every sauce is
                  simmered slowly, every crust is wood-fired to perfection, and every dessert is
                  balanced with authentic spices. Food cooked with sincerity always tastes better.
                </p>
              )}
              {activeTab === "promise" && (
                <p>
                  No artificial preservatives, no microwave shortcuts, and zero compromise on safety.
                  We treat every guest like family walking into our own dining room, backed by 100%
                  fresh sourcing and uncompromised culinary hygiene.
                </p>
              )}
            </div>

            {/* Key Quality Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {highlights.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-gray-700 dark:text-gray-200 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-orange-100 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                  15+
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                  Years of Flavor
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-orange-100 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                  25+
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                  Culinary Masters
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-orange-100 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                  Smiles Served
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate("/reservation")}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Reserve a Table</span>
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/fullmenu")}
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-700 hover:border-orange-500 font-bold hover:text-orange-600 dark:hover:text-orange-400 hover:-translate-y-0.5 transition-all"
              >
                Explore Full Menu
              </button>
            </div>
          </div>

          {/* Right Column: Visual Composite Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Restaurant Ambience Photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group">
                <img
                  src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Savory Haven Dining Experience"
                  className="w-full h-[420px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Image caption badge */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs font-semibold tracking-wider uppercase text-orange-300">
                    Warm Hospitality & Ambience
                  </p>
                  <p className="text-sm sm:text-base font-bold mt-1">
                    Crafted for unforgettable gatherings & conversations.
                  </p>
                </div>
              </div>

              {/* Overlapping Floating Badge: Ratings */}
              <div className="absolute -top-6 -left-6 sm:-left-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-xl border border-orange-100 dark:border-slate-700 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <Star size={24} className="fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-base font-extrabold text-gray-900 dark:text-white">
                    <span>4.9 / 5.0</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    12,000+ Happy Guests
                  </p>
                </div>
              </div>

              {/* Overlapping Floating Badge: Hygiene & Fresh */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl px-5 py-3.5 rounded-2xl shadow-xl border border-orange-100 dark:border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    100% Farm Fresh
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Daily sourced produce
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-7 rounded-3xl bg-white dark:bg-slate-800/90 border border-orange-100/80 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={26} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 dark:bg-slate-700/80 text-orange-700 dark:text-orange-300 border border-orange-200/50 dark:border-slate-600">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
