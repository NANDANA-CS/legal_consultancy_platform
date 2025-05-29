import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
clientId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
lawyerId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
title: {
type: String,
required: true,
trim: true
},
description: {
type: String,
required: true
},
status: {
type: String,
enum: ['pending', 'reviewed', 'in-progress', 'closed'],
default: 'pending'
},
updates: [
{
message: {
type: String,
required: true
},
timestamp: {
type: Date,
default: Date.now
}
}
]
}, {
timestamps: true // adds createdAt and updatedAt fields
});

export default mongoose.model('Case', caseSchema);