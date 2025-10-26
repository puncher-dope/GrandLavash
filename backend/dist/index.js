"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = 5001;
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const basketRoute_1 = __importDefault(require("./routes/basketRoute"));
const orderRouter_1 = __importDefault(require("./routes/orderRouter"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
app.use('/admin', adminRoute_1.default);
app.use("/auth", authRoute_1.default);
app.use("/products", productRouter_1.default);
// app.use(authenticated);
app.use('/basket', basketRoute_1.default);
app.use("/orders", orderRouter_1.default);
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
