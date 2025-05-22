import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  profilepic: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, default:null },
  phoneNumber: { type: String, default:null },
  role: { type: String, default: 'client' },
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Client', clientSchema);