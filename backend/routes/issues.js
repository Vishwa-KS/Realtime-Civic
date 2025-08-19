const express = require('express');
const Issue = require('../models/Issue');
const verifyToken = require('../middleware/auth');  // Import your middleware
const router = express.Router();

// POST route to create an issue (protected route)
router.post('/issues', verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Create a new issue, linking it to the user who created it
    const newIssue = new Issue({
      title,
      description,
      reportedBy: req.user.id  // Get the user ID from the decoded JWT
    });

    await newIssue.save();
    res.status(200).json({ message: 'Issue submitted successfully', issue: newIssue });
  } catch (error) {
    res.status(500).json({ error: 'Error creating issue' });
  }
});

module.exports = router;
