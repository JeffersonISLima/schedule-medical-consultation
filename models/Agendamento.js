const mongoose = require('mongoose');

const { Schema } = mongoose;

const appointmentSchema = new Schema({
  busy: { type: Boolean },
  date: { type: String },
  id_patient: { type: String },
  id_doctor: { type: String },
});

const appointment = mongoose.model('appointment', appointmentSchema);
module.exports = appointment;
