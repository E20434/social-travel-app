const express = require("express");
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing
} = require("../controllers/listingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);
router.post("/", protect, createListing);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);

module.exports = router;