const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  className: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  status: { type: String, default: 'Absent' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);