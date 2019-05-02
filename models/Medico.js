const mongoose = require('mongoose');

const { Schema } = mongoose;

const DoctorSchema = new Schema({
  name: { type: String },
  crm: { type: String },
  specialty: { type: String },
  email: { type: String },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;
