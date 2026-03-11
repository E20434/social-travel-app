const Listing = require("../models/Listing");

const createListing = async (req, res) => {
  try {
    const {
      title,
      location,
      imageUrl,
      shortDescription,
      fullDescription,
      price
    } = req.body;

    if (!title || !location || !imageUrl || !shortDescription || !fullDescription) {
      return res.status(400).json({ message: "Please fill all required listing fields" });
    }

    const listing = await Listing.create({
      title,
      location,
      imageUrl,
      shortDescription,
      fullDescription,
      price: price || null,
      user: req.user._id
    });

    const populated = await listing.populate("user", "name email");

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Server error creating listing" });
  }
};

const getListings = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search && search.trim()) {
      query = { $text: { $search: search.trim() } };
    }

    const listings = await Listing.find(query)
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(listings);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching listings" });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("user", "name email");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.status(200).json(listing);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching listing" });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }

    const {
      title,
      location,
      imageUrl,
      shortDescription,
      fullDescription,
      price
    } = req.body;

    listing.title = title ?? listing.title;
    listing.location = location ?? listing.location;
    listing.imageUrl = imageUrl ?? listing.imageUrl;
    listing.shortDescription = shortDescription ?? listing.shortDescription;
    listing.fullDescription = fullDescription ?? listing.fullDescription;
    listing.price = price === "" ? null : (price ?? listing.price);

    await listing.save();

    const updated = await Listing.findById(listing._id).populate("user", "name email");
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Server error updating listing" });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await listing.deleteOne();

    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting listing" });
  }
};

module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing
};

