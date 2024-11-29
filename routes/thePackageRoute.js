const express = require("express");
const router = express.Router();
const Package = require("../models/package");

// Route to create a package
router.post("/create", async (req, res) => {
  try {
    const {
      trackingId,
      senderName,
      senderEmail,
      senderPhone,
      senderLocation,
      receiverName,
      receiverEmail,
      receiverPhone,
      receiverLocation,
      deliveryMode,
      contentName,
      contentWeight,
      deliveryStatus
    } = req.body;

    // Check if a package with the same trackingId already exists
    const existingPackage = await Package.findOne({ trackingId });
    if (existingPackage) {
      return res.status(400).json({error: true, message: "Package with this tracking ID already exists." });
    }

    // Create a new package instance
    const newPackage = new Package({
      trackingId,
      senderName,
      senderEmail,
      senderPhone,
      senderLocation,
      receiverName,
      receiverEmail,
      receiverPhone,
      receiverLocation,
      deliveryMode,
      contentName,
      contentWeight,
      deliveryStatus
    });

    // Save the package to the database
    const savedPackage = await newPackage.save();

    // Respond with the saved package details
    res.status(201).json(savedPackage);
  } catch (error) {
    // Respond with error details
    res.status(500).json({ message: error.message || "An error occurred while creating the package." });
  }
});

router.post("/update/:trackingId", async (req, res, next) => {
  const { trackingId } = req.params;
  const {
   deliveryStatus
  } = req.body;


  const updateData = req.body;

  try {
    const package = await Package.findOneAndUpdate({ trackingId }, updateData, { new: true });

    if (!package) {
      return res.status(400).json({ message: 'Package not found' });
    }

    res.json(package);
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/single/:trackingId", async (req, res, next) => {
  const { trackingId } = req.params;

  try {
    const package = await Package.findOne({ trackingId });

    if (!package) {
      return res.status(400).json({ message: 'Package not found' });
    }

    res.json(package);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

router.get("/packages", async (req, res, next) => {

  try {
    const packages = await Package.find();

    if (!packages) {
      return res.status(400).json({ message: 'No packages' });
    }

    res.json(packages);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

module.exports = router;
