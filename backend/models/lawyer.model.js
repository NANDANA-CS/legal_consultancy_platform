
import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'lawyer', 
  },
  expertise: {
    type: String, 
  },
});


export default mongoose.model('Lawyer', lawyerSchema)
