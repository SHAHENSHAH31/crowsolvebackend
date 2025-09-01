import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    solution: { type: Schema.Types.ObjectId, ref: "Solution", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }], 
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
