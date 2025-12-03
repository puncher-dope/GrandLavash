"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const PORT = process.env.PORT || 5001;
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        // "https://grandlavash-production.up.railway.app",
        // "https://grandlavash-front-gliqex511-puncher-dopes-projects.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const basketRoute_1 = __importDefault(require("./routes/basketRoute"));
const orderRouter_1 = __importDefault(require("./routes/orderRouter"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
app.use('/admin', adminRoute_1.default);
app.use("/auth", authRoute_1.default);
app.use("/products", productRouter_1.default);
app.use('/basket', basketRoute_1.default);
app.use("/orders", orderRouter_1.default);
mongoose_1.default.connect(process.env.DB_CONNECTION_STRING).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
