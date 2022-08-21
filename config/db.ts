import mongoose from "mongoose";

export const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI as string)

  console.log(`DB Connected: ${conn.connection.host}`)
}