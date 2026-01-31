const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
});

module.exports = mongoose.model('Class', ClassSchema);