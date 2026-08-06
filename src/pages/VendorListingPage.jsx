import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Clock3, LocateFixed, MapPin, Search, Star, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getDeliveryLocation,
  saveDeliveryLocation,
} from "../lib/deliveryLocation";

const VendorListingPage = () => {
  const [vendors, setVendors] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState(getDeliveryLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async (coords = location) => {
    setLoading(true);
    setError("");
    try {
      const lat = Number.isFinite(coords.lat) ? coords.lat : 22.5726;
      const lng = Number.isFinite(coords.lng) ? coords.lng : 88.3639;
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/nearby?lat=${lat}&lng=${lng}`,
      );
      setVendors(data);
    } catch {
      setError("We could not load local stores. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const useCurrentLocation = () => {
    if (!navigator.geolocation)
      return setError("Location is not supported by this browser.");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const next = await saveDeliveryLocation(
          coords.latitude,
          coords.longitude,
        );
        setLocation(next);
        load(next);
      },
      () =>
        setError(
          "Allow location permission or choose your delivery location first.",
        ),
    );
  };
  const categories = useMemo(
    () => [
      "All",
      ...new Set(vendors.map((vendor) => vendor.category).filter(Boolean)),
    ],
    [vendors],
  );
  const visible = vendors.filter(
    (vendor) =>
      (category === "All" || vendor.category === category) &&
      `${vendor.storeName} ${vendor.category} ${vendor.storeAddress}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="min-h-screen bg-[#faf8f3] pb-14">
      <div className="page-shell py-7 sm:py-10">
        <section className="relative overflow-hidden rounded-[26px] border border-[#e7e4dd] bg-[#f4eadb] p-6 sm:p-8">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#e86f32]/10 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#2f7d4a]">
                Neighbourhood marketplace
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-[#182018] sm:text-4xl">
                Stores near your delivery area
              </h1>
              <p className="mt-2 text-sm text-[#697168]">
                Browse trusted local sellers and shop everything from one store
                at a time.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={useCurrentLocation}
              className="rounded-xl bg-white"
            >
              <LocateFixed className="mr-2 h-4 w-4" /> Use current location
            </Button>
          </div>
          <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9189]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 w-full rounded-xl border border-[#e7e4dd] bg-white pl-12 pr-3 text-sm outline-none focus:border-[#e86f32]"
                placeholder="Search stores or categories"
              />
            </div>
            <Link
              to="/customer/location"
              title={location.label}
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#e7e4dd] bg-white px-4 text-sm font-bold text-[#4c564b] sm:w-auto sm:max-w-[230px]"
            >
              <MapPin className="h-4 w-4 shrink-0 text-[#2f7d4a]" />
              <span className="truncate">{location.label}</span>
            </Link>
          </div>
        </section>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${category === item ? "bg-[#182018] text-white" : "border border-[#e7e4dd] bg-white text-[#566056]"}`}
            >
              {item}
            </button>
          ))}
        </div>
        {error ? (
          <div className="mt-8 rounded-2xl border border-[#f0c9c4] bg-[#fff6f5] p-6 text-center">
            <p className="font-bold text-[#9b332a]">{error}</p>
            <Button onClick={() => load()} className="mt-4 rounded-xl">
              Try again
            </Button>
          </div>
        ) : loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-2xl bg-[#eee8dd]"
              />
            ))}
          </div>
        ) : visible.length ? (
          <section className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold">
                {visible.length} local{" "}
                {visible.length === 1 ? "store" : "stores"}
              </h2>
              <p className="max-w-[45%] truncate text-xs font-bold text-[#697168]">
                {location.label}
              </p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((vendor) => (
                <Link
                  key={vendor._id}
                  to={`/customer/products/${vendor._id}`}
                  className="group rounded-2xl border border-[#ebe5d9] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f3ec] text-[#2f7d4a]">
                      <Store className="h-6 w-6" />
                    </span>
                    <span className="rounded-full bg-[#e8f3ec] px-2.5 py-1 text-[10px] font-bold text-[#2f7d4a]">
                      Open now
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-[#2f7d4a]">
                    {vendor.category}
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold text-[#182018]">
                    {vendor.storeName}
                  </h3>
                  <p className="mt-1 truncate text-sm text-[#697168]">
                    {vendor.storeAddress || "Local store"}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-[#eee8dd] pt-4 text-xs font-bold text-[#566056]">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-[#f3a027] text-[#f3a027]" />{" "}
                      {Number(vendor.averageRating || 0).toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-[#2f7d4a]" /> 25–35
                      min
                    </span>
                    <span className="text-[#e86f32]">Visit →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center">
            <Store className="mx-auto h-8 w-8 text-[#2f7d4a]" />
            <h2 className="mt-3 text-xl font-extrabold">No matching stores</h2>
            <p className="mt-2 text-sm text-[#697168]">
              Try another search, category, or delivery location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default VendorListingPage;
