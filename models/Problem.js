import mongoose from 'mongoose';
const { Schema } = mongoose;

const problemSchema = new Schema({
author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String, required: true },
description: { type: String, required: true },
image: { url: String, public_id: String },
location: { type: String, required: true }
}, { timestamps: true });


export default mongoose.model('Problem', problemSchema);