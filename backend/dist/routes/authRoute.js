"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router({ mergeParams: true });
const User_1 = require("../models/User");
const prettyLog_1 = __importDefault(require("../helpers/prettyLog"));
const token_1 = require("../helpers/token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
router.get("/checkAuth", async (req, res) => {
    try {
        const { accessToken, refreshToken } = req.cookies;
        if (!accessToken && refreshToken) {
            return res.status(200).json({
                authenticated: false,
                shouldRefresh: true,
                message: "Access token expired, refresh required",
            });
        }
        else if (!accessToken) {
            return res
                .status(200)
                .json({ authenticated: false, message: "No access token" });
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            return res
                .status(200)
                .json({ authenticated: false, message: "User not found" });
        }
        res.status(200).json({
            authenticated: true,
            user: user,
        });
    }
    catch (e) {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            return res.status(200).json({
                authenticated: false,
                shouldRefresh: true,
                message: "Access token expired, refresh required",
            });
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken").status(200).json({
            authenticated: false,
            message: "Session expired",
        });
    }
});
router.post("/register", async (req, res) => {
    (0, prettyLog_1.default)("info", "Новая регистрация user");
    try {
        const { user, accessToken, refreshToken } = await (0, user_1.registerUser)(req.body.login, req.body.phone);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            domain: process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
            path: "/",
            maxAge: 15 * 60 * 1000, //15 minutes
        });
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            domain: process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        })
            .status(201)
            .json({ user });
    }
    catch (e) {
        res.status(401).send({ error: e.message || "Unknown error" });
    }
});
router.post("/login", async (req, res) => {
    (0, prettyLog_1.default)("info", "Новый логин user");
    try {
        const { user, accessToken, refreshToken } = await (0, user_1.loginUser)(req.body.login, req.body.phone);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            domain: process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
            path: "/",
            maxAge: 15 * 60 * 1000, //15 minutes
        });
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            domain: process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        })
            .status(200)
            .json({
            user,
        });
    }
    catch (e) {
        res.status(401).send({ error: e.message || "Unknown error" });
    }
});
router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ error: "No refresh token provided" });
        }
        const decoded = (0, token_1.verifyRefreshToken)(refreshToken);
        const user = await User_1.User.findOne({
            _id: decoded.id,
            refreshToken,
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }
        const newAccessToken = (0, token_1.generateAccessToken)({ id: user.id });
        const newRefreshToken = (0, token_1.generateRefreshToken)({ id: user.id });
        await User_1.User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            domain: process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
            path: "/",
            maxAge: 15 * 60 * 1000, //15 minutes
        });
        res
            .cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            domain: process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        })
            .status(200)
            .json({ message: "Tokens refreshed successfully" });
    }
    catch (e) {
        res.status(401).json({ error: e.message });
    }
});
router.post("/logout", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (userId) {
            await User_1.User.findByIdAndUpdate(userId, { refreshToken: null });
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken").status(200).json("Logged out successfully");
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
