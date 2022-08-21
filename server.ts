import express, { Express } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import users from "./routes/users";
import records from "./routes/records";
import reports from "./routes/reports";
import morgan from "morgan";
import cors from "cors";
import errorHandler from "./middleware/error";
import { protect } from "./middleware/auth";

dotenv.config();
connectDB();

const app: Express = express();

app.use(express.json());
app.use(cors());

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routers
app.use("/api/v1/users", users);
app.use(protect);
app.use("/api/v1/records", records);
app.use("/api/v1/report", reports);

app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
