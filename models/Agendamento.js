const mongoose = require('mongoose');

const { Schema } = mongoose;

const appointmentSchema = new Schema({
  group1: { type: String },
  specialty: { type: String },
  doctor: { type: String },
  weekday: { type: String },
  hour: { type: String },
  id_patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  /* id_doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' }, */
});

const appointment = mongoose.model('appointment', appointmentSchema);
module.exports = appointment;
