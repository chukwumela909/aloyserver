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
  const updateData = req.body;

  try {
    // Validate that trackingId exists
    if (!trackingId) {
      return res.status(400).json({ message: 'Tracking ID is required' });
    }

    // Remove any fields that shouldn't be updated
    delete updateData._id;
    delete updateData.trackingId;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Find and update the package
    const package = await Package.findOneAndUpdate(
      { trackingId }, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!package) {
      return res.status(400).json({ message: 'Package not found' });
    }

    res.json({
      message: 'Package updated successfully',
      package: package
    });
  } catch (error) {
    console.error('Error updating package:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add DELETE endpoint for package deletion
router.delete("/delete/:trackingId", async (req, res, next) => {
  const { trackingId } = req.params;

  try {
    const package = await Package.findOneAndDelete({ trackingId });

    if (!package) {
      return res.status(400).json({ message: 'Package not found' });
    }

    res.json({ 
      message: 'Package deleted successfully',
      deletedPackage: package
    });
  } catch (error) {
    console.error('Error deleting package:', error);
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
