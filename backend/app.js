import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";

const app = express();
dotenv.config({ path: "./config/config.env" });
// dotenv.config();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res, next)=>{
  return res.status(200).json({
    success: true,
    message: "Home Route"
})})
app.use("/api/v1/reservation", reservationRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


dbConnection();
app.use(errorMiddleware);

export default app;