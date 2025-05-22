import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
  profilePic: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'lawyer' },
  phoneNumber: { type: String, required: true },
  barRegistrationNumber: { type: String, required: true, unique: true },
  barCouncilState: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  currentWorkplace: { type: String, required: true },
  barCouncilId: { type: String, default: null },
  availabilitySlots: [{
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String },
  }],
  expertise: { type: String, default: null },
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Lawyer', lawyerSchema);