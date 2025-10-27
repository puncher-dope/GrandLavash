require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5001;

const app = express();

// Middlewares
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ extended: true, limit:'10mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: true, // ✅ Разрешить все origins временно
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ✅ Обработка preflight запросов
app.options('*', cors());

// ✅ Используйте require для роутов вместо import
app.use('/admin', require('./routes/adminRoute'));
app.use("/auth", require('./routes/authRoute'));
app.use("/products", require('./routes/productRouter'));
app.use('/basket', require('./routes/basketRoute'));
app.use("/orders", require('./routes/orderRouter'));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// MongoDB connection
mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });