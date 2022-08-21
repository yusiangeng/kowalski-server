import { Schema, model } from "mongoose";

const RecordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: [true, "Please specify an amount"] },
  type: {
    type: String,
    enum: ["Income", "Expense"],
    required: [true, "Please specify a type"],
  },
  category: { type: String, required: [true, "Please specify a category"] },
  description: { type: String },
  date: { type: Date, required: [true, "Please specify a date"] },
});

export default model("Record", RecordSchema);
