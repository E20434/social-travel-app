const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 220
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
      trim: true
    },
    price: {
      type: Number,
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// Useful index for feed sorting + search
listingSchema.index({ createdAt: -1 });
listingSchema.index({ title: "text", location: "text", shortDescription: "text", fullDescription: "text" });

module.exports = mongoose.model("Listing", listingSchema);