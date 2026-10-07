import { useEffect, useState } from "react";

import SearchBar from "../components/marketplace/SearchBar";
import FilterBar from "../components/marketplace/FilterBar";
import ProduceList from "../components/marketplace/ProduceList";

import { getListings } from "../services/listingService";

function Marketplace() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getListings();

        setListings(response.listings || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load marketplace listings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    const crop = (listing.crop || "").toLowerCase();

    const matchesSearch = crop.includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || crop === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              SENE Marketplace
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Fresh produce, directly from farmers.
            </h1>

            <p className="mt-3 text-gray-600">
              Browse available agricultural products and find the produce
              you're looking for.
            </p>
          </div>

          <div className="mt-8">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FilterBar value={category} onChange={setCategory} />

        <div className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {loading
                ? "Loading listings..."
                : `${filteredListings.length} ${
                    filteredListings.length === 1
                      ? "listing"
                      : "listings"
                  } available`}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <ProduceList listings={filteredListings} />
          )}
        </div>
      </section>
    </main>
  );
}

export default Marketplace;