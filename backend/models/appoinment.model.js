import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lawyer',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);