import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, isAuthenticated } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/listings/${id}`);
      setListing(data);
    } catch (error) {
      console.error("Failed to fetch listing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    try {
      await api.delete(`/listings/${id}`);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8">Loading...</div>;
  if (!listing) return <div className="max-w-5xl mx-auto px-4 py-8">Listing not found</div>;

  const isOwner =
    isAuthenticated &&
    auth?.user?.id &&
    (auth.user.id === listing.user?._id || auth.user.id === listing.user?.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-[420px] object-cover"
        />

        <div className="p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold">{listing.title}</h1>
              <p className="text-sky-700 text-lg mt-2">📍 {listing.location}</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold">
                {listing.price ? `$${listing.price}` : "Price not specified"}
              </p>
            </div>
          </div>

          <div className="mt-6 text-slate-700 space-y-4">
            <p>{listing.fullDescription}</p>
            <p>
              <span className="font-semibold">Posted by:</span> {listing.user?.name}
            </p>
          </div>

          {isOwner && (
            <div className="mt-8 flex gap-3">
              <Link
                to={`/edit/${listing._id}`}
                className="bg-amber-500 text-white px-5 py-3 rounded-lg"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-3 rounded-lg"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}