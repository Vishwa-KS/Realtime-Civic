// backend/routes/report.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Issue = require('../models/Issue'); // Import Issue model

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
  },
});

const upload = multer({ storage: storage });

// Report issue route with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { issueDescription, location, userId } = req.body;
    const image = req.file; // If an image is uploaded
    const imageUrl = req.body.imageUrl; // If the image is taken from the camera

    // Create new issue document
    const newIssue = new Issue({
      user: userId, // userId should be passed in request body or extracted from auth middleware
      title: issueDescription,
      description: imageUrl ? `Image URL: ${imageUrl}` : '',
      location: location,
      fileUrl: image ? `/uploads/${image.filename}` : '', // Save uploaded file path
    });

    await newIssue.save();

    res.status(201).json({ message: 'Issue reported successfully', issue: newIssue });
  } catch (error) {
    console.error('Error reporting issue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reports by user ID
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId query parameter' });
    }

    const issues = await Issue.find({ user: userId }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
