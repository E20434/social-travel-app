import { useEffect, useState } from "react";
import api from "../services/api";
import ListingCard from "../components/ListingCard";

export default function Feed() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchListings = async (query = "") => {
    try {
      setLoading(true);
      const { data } = await api.get(`/listings${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(search);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Discover Travel Experiences</h1>
        <p className="text-slate-600 mt-2">
          Explore unique tours and activities shared by local providers.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by title, location, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-3 rounded-lg bg-white"
        />
        <button className="bg-sky-600 text-white px-5 rounded-lg">Search</button>
      </form>

      {loading ? (
        <p>Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-slate-600">No listings found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}