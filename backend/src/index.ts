require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from"cookie-parser";
const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ extended: true, limit:'10mb' }));
app.use(cookieParser());
app.use(
   cors({
    origin: [
      "http://localhost:3000",
      // "https://grandlavash-production.up.railway.app",
      // "https://grandlavash-front-gliqex511-puncher-dopes-projects.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
import authRouter from './routes/authRoute'
import adminRouter from './routes/adminRoute'
import basketRouter from './routes/basketRoute'
import orderRouter from "./routes/orderRouter"
import productRouter from "./routes/productRouter"








app.use('/admin', adminRouter)
app.use("/auth", authRouter);
app.use("/products", productRouter)
app.use('/basket', basketRouter)
app.use("/orders", orderRouter);


mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
