import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
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
    dateTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled',
    },
    meetLink: {
        type: String,
        required: true,
    },
    accept:{
        type:Boolean,
        default:false,
    },
    notes: {
        type: String,
        default: '',
    }
}, {
    timestamps: true
});

export default mongoose.model('Consultation', consultationSchema);