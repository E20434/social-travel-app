import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    location: "",
    imageUrl: "",
    shortDescription: "",
    fullDescription: "",
    price: ""
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.get(`/listings/${id}`);
        setForm({
          title: data.title || "",
          location: data.location || "",
          imageUrl: data.imageUrl || "",
          shortDescription: data.shortDescription || "",
          fullDescription: data.fullDescription || "",
          price: data.price ?? ""
        });
      } catch {
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.put(`/listings/${id}`, {
        ...form,
        price: form.price === "" ? "" : Number(form.price)
      });
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow border">
        <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Experience Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="url"
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <textarea
            name="shortDescription"
            placeholder="Short Description"
            value={form.shortDescription}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg min-h-24"
            required
          />

          <textarea
            name="fullDescription"
            placeholder="Full Description"
            value={form.fullDescription}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg min-h-36"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price (optional)"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <button className="bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}