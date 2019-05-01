const mongoose = require('mongoose');

const { Schema } = mongoose;

const appointmentSchema = new Schema({
  /* busy: { type: Boolean },
  date: { type: Date },
  colocar neste schema os valores que virão do form
  */
  id_patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  id_doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
});

const appointment = mongoose.model('appointment', appointmentSchema);
module.exports = appointment;
