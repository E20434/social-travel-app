import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateListing() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    location: "",
    imageUrl: "",
    shortDescription: "",
    fullDescription: "",
    price: ""
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : null
      };

      const { data } = await api.post("/listings", payload);
      navigate(`/listings/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow border">
        <h1 className="text-3xl font-bold mb-6">Create Travel Experience</h1>

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
            Publish Listing
          </button>
        </form>
      </div>
    </div>
  );
}