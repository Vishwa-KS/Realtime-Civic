const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Issue', IssueSchema);
