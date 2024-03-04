import mongoose, { Types } from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: String,
    startDate:Date,
    endDate:Date,
    description:String,
    images : [
        {type:Types.ObjectId,ref:"Image"}
    ],
    user: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
