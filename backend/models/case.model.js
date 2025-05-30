import mongoose from 'mongoose';

   const caseSchema = new mongoose.Schema(
     {
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
       consultationId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Consultation',
         required: true,
       },
       title: {
         type: String,
         required: true,
         trim: true,
       },
       type: {
         type: String,
         required: true,
         trim: true,
       },
       description: {
         type: String,
         required: true,
         trim: true,
       },
       status: {
         type: String,
         enum: ['pending', 'reviewed', 'in-progress', 'closed'],
         default: 'pending',
       },
       updates: [
         {
           message: {
             type: String,
             required: true,
           },
           timestamp: {
             type: Date,
             default: Date.now,
           },
         },
       ],
       documents: [
         {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Document',
         },
       ],
     },
     {
       timestamps: true,
     }
   );

   export default mongoose.model('Case', caseSchema);