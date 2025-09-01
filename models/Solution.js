import mongoose from 'mongoose';
const { Schema } = mongoose;


const solutionSchema = new Schema({
problem: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
text: { type: String, required: true },
upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });


export default mongoose.model('Solution', solutionSchema);