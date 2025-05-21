
import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
  profilepic: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'lawyer' },
  expertise: { type: String, },
  date:{type:Date,default:null}
})


export default mongoose.model('Lawyer', lawyerSchema)
