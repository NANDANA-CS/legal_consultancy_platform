import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  profilepic: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, default: 'client' },
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Client', clientSchema);