import mongoose, { Types } from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    name: String,
    user: { type: Types.ObjectId, ref: "User" },
    likeCount:{type:Number,default:0}
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
