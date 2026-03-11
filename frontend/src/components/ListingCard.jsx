import { Link } from "react-router-dom";

function timeAgo(dateString) {
  const now = new Date();
  const posted = new Date(dateString);
  const seconds = Math.floor((now - posted) / 1000);

  const intervals = [
    { label: "year", value: 31536000 },
    { label: "month", value: 2592000 },
    { label: "day", value: 86400 },
    { label: "hour", value: 3600 },
    { label: "minute", value: 60 }
  ];

  for (const item of intervals) {
    const count = Math.floor(seconds / item.value);
    if (count >= 1) {
      return `Posted ${count} ${item.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Posted just now";
}

export default function ListingCard({ listing }) {
  return (
    <div className="bg-white rounded-2xl shadow border overflow-hidden hover:shadow-lg transition">
      <img
        src={listing.imageUrl}
        alt={listing.title}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">
        <h3 className="text-xl font-semibold">{listing.title}</h3>
        <p className="text-sky-700 font-medium mt-1">📍 {listing.location}</p>
        <p className="text-slate-600 mt-3">{listing.shortDescription}</p>

        <div className="mt-4 text-sm text-slate-500 space-y-1">
          <p>By {listing.user?.name || "Unknown"}</p>
          <p>{timeAgo(listing.createdAt)}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold">
            {listing.price ? `$${listing.price}` : "Price not specified"}
          </span>
          <Link
            to={`/listings/${listing._id}`}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}