import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { resolveProductImage } from "../lib/images";
import { useDeliveryLocation } from "../lib/deliveryLocation";

const categories = [
  { label: "Grocery", emoji: "🥬", tone: "bg-[#e8f3ec]" },
  { label: "Fashion", emoji: "👜", tone: "bg-[#f7e9df]" },
  { label: "Home", emoji: "🏠", tone: "bg-[#f5efd9]" },
  { label: "Beauty", emoji: "✨", tone: "bg-[#f5e5ed]" },
  { label: "Electronics", emoji: "💻", tone: "bg-[#e7eef8]" },
  { label: "More", emoji: "•••", tone: "bg-[#eeeae2]" },
];

const HomeSkeleton = () => (
  <div className="page-shell py-8 sm:py-10">
    <div className="h-36 animate-pulse rounded-[26px] bg-[#eee8dd]" />
    <div className="mt-8 flex gap-3 overflow-hidden">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-20 w-20 shrink-0 animate-pulse rounded-2xl bg-[#eee8dd]"
        />
      ))}
    </div>
    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-2xl bg-[#eee8dd]"
        />
      ))}
    </div>
    <p className="mt-6 text-center text-sm font-medium text-[#697168]">
      Loading local stores… the first request can take up to a minute while the
      free server wakes up.
    </p>
  </div>
);

const UserHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularVendors, setPopularVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { location } = useDeliveryLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/homepage`,
        );
        setFeaturedProducts(data.featuredProducts || []);
        setPopularVendors(data.popularVendors || []);
      } catch (requestError) {
        setError(
          "We could not load nearby stores right now. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <HomeSkeleton />;
  const searchMarketplace = (event) => {
    event.preventDefault();
    if (search.trim())
      navigate(`/customer/search?q=${encodeURIComponent(search.trim())}`);
  };
  const categorySearch = (category) => {
    if (category.label !== "More")
      navigate(
        `/customer/search?category=${encodeURIComponent(category.label === "Fashion" ? "Clothing" : category.label)}`,
      );
  };
  const updateLocation = () => navigate("/customer/location");

  return (
    <div className="bg-[#faf8f3] pb-12 sm:pb-16">
      <div className="page-shell pt-6 sm:pt-9">
        <section className="relative overflow-hidden rounded-[26px] border border-[#e7e4dd] bg-[#f4eadb] px-5 py-7 sm:px-8 sm:py-9">
          <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#e86f32]/10 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold text-[#2f7d4a]">
                <Sparkles className="h-4 w-4" /> Good to see you
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#182018] sm:text-4xl">
                Welcome back, {user?.name?.split(" ")[0] || "neighbour"}.
              </h1>
              <p className="mt-2 text-sm text-[#697168]">
                Find fresh favourites from stores around you.
              </p>
            </div>
            <button
              type="button"
              onClick={updateLocation}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-[#ddd4c5] bg-white/90 px-3 py-2 text-xs font-bold text-[#4c564b] sm:self-auto"
            >
              <MapPin className="h-4 w-4 text-[#2f7d4a]" /> {location.label}
            </button>
          </div>
          <form onSubmit={searchMarketplace} className="relative mt-6 max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9189]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 w-full rounded-xl border border-[#e7e4dd] bg-white !pl-12 pr-4 text-sm outline-none transition placeholder:text-[#8a9189] focus:border-[#e86f32] focus:ring-2 focus:ring-[#e86f32]/15"
              placeholder="Search products & stores"
            />
          </form>
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-[-0.02em] text-[#182018]">
              Shop by category
            </h2>
            <span className="text-xs font-bold text-[#697168]">
              More coming soon
            </span>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <button
                key={category.label}
                type="button"
                onClick={() => categorySearch(category)}
                className="group flex min-w-[78px] flex-col items-center gap-2"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl transition group-hover:-translate-y-0.5 group-hover:shadow-md ${category.tone}`}
                >
                  {category.emoji}
                </span>
                <span className="text-xs font-bold text-[#4c564b]">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {error ? (
          <section className="mt-10 rounded-2xl border border-[#f0c9c4] bg-[#fff6f5] p-6 text-center">
            <p className="font-bold text-[#9b332a]">{error}</p>
            <Button
              className="mt-4 rounded-xl"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </section>
        ) : (
          <>
            <section className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2f7d4a]">
                    Picked for you
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.035em] text-[#182018]">
                    Featured near you
                  </h2>
                </div>
                <Link
                  to="/customer/vendors"
                  className="mb-1 inline-flex items-center gap-1 text-sm font-bold text-[#e86f32] hover:text-[#c95722]"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {featuredProducts.length ? (
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {featuredProducts.map((product) => (
                    <Link
                      key={product._id}
                      to={`/customer/view-product/${product._id}`}
                      className="group overflow-hidden rounded-2xl border border-[#ebe5d9] bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#352c1d]/8"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#f4efe6]">
                        <img
                          src={resolveProductImage(product.image)}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.src = "/noimage.png";
                          }}
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-[#2f7d4a] backdrop-blur">
                          Fresh pick
                        </span>
                      </div>
                      <div className="p-3.5">
                        <p className="truncate text-[11px] font-bold text-[#697168]">
                          {product.vendor?.storeName || "Local store"}
                        </p>
                        <h3 className="mt-1 truncate text-sm font-extrabold text-[#182018]">
                          {product.name}
                        </h3>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-base font-extrabold text-[#182018]">
                            ₹{product.price}
                          </p>
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff0e7] text-[#e86f32]">
                            <ShoppingBag className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl bg-white p-6 text-sm text-[#697168]">
                  No products are available yet.
                </p>
              )}
            </section>

            <section className="mt-12">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2f7d4a]">
                    Your neighbourhood
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.035em] text-[#182018]">
                    Local stores you’ll love
                  </h2>
                </div>
                <Link
                  to="/customer/vendors"
                  className="mb-1 inline-flex items-center gap-1 text-sm font-bold text-[#e86f32] hover:text-[#c95722]"
                >
                  Browse stores <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {popularVendors.length ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {popularVendors.map((vendor) => (
                    <Link
                      key={vendor._id}
                      to={`/customer/products/${vendor._id}`}
                      className="group flex items-center gap-4 rounded-2xl border border-[#ebe5d9] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#352c1d]/5"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3ec] text-[#2f7d4a]">
                        <Store className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate font-extrabold text-[#182018]">
                            {vendor.storeName || vendor.name}
                          </h3>
                          <ArrowRight className="h-4 w-4 shrink-0 text-[#b1b6ae] transition group-hover:translate-x-0.5 group-hover:text-[#e86f32]" />
                        </div>
                        <p className="mt-1 truncate text-xs font-medium text-[#697168]">
                          {vendor.category} · {vendor.storeAddress || "Nearby"}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs font-bold text-[#566056]">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-[#f3a027] text-[#f3a027]" />
                            {Number(vendor.averageRating || 0).toFixed(1)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5 text-[#2f7d4a]" />
                            25–35 min
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl bg-white p-6 text-sm text-[#697168]">
                  No stores are available yet.
                </p>
              )}
            </section>

            <section className="mt-12 overflow-hidden rounded-[26px] bg-[#e8f3ec] px-6 py-7 sm:px-9">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#2f7d4a]">
                    <Tag className="h-4 w-4" /> For local sellers
                  </span>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-[#182018]">
                    Have a store to share?
                  </h2>
                  <p className="mt-1 text-sm text-[#566056]">
                    Join UrbanHive and reach more neighbours nearby.
                  </p>
                </div>
                <Link to="/vendor/register">
                  <Button className="rounded-xl bg-[#182018] hover:bg-[#263126]">
                    Become a seller <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default UserHome;
