const express = require("express");
const router = express.Router();
const Package = require("../models/package");

// Route to create a package
router.post("/create", async (req, res, next) => {
  const {
    trackingId,
    packageName,
    pickup,
    destination,
    currentLocation,
    checkpoints,
    packageDescription,
    packageStatus,
    dateOfDeparture,
    dateOfArrival
  } = req.body;

  const package = await Package.findOne({ trackingId });

    if (package) {
      return res.status(400).json({ message: 'Package already exist' });
    }

  // // Create a new package instance
  const newPackage = new Package({
    trackingId,
    packageName,
    pickup,
    destination,
    currentLocation,
    checkpoints,
    packageDescription,
    packageStatus,
    dateOfDeparture,
    dateOfArrival
  });

  try {
    // Save the package to the database
    const savedPackage = await newPackage.save();
    res.status(200).json(savedPackage);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  // res.json({message: req.body})
});

router.post("/update/:trackingId", async (req, res, next) => {
  const { trackingId } = req.params;
  const {
    packageName,
    pickup,
    destination,
    currentLocation,
    checkpoints,
    packageDescription,
    packageStatus,
    dateOfDeparture,
    dateOfArrival
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
