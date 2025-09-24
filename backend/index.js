require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authenticated = require("./middlewares/authenticated");
const PORT = 5001;


const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // Важно!
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
const authRouter = require('./routes/authRoute')
const adminRouter = require('./routes/adminRoute')
const basketRouter = require('./routes/basketRoute')
const orderRouter = require("./routes/orderRouter");
const productRouter = require("./routes/productRouter");








app.use('/admin', adminRouter)
app.use("/auth", authRouter);
app.use("/products", productRouter)
app.use(authenticated);
app.use('/basket', basketRouter)
app.use("/orders", orderRouter);


mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
