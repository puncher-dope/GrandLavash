"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//admin
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router({ mergeParams: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_1 = require("../controllers/admin");
const token_1 = require("../helpers/token");
const Admin_1 = require("../models/Admin");
const mapAdmin_1 = require("../helpers/mapAdmin");
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
        const admin = await Admin_1.Admin.findById(decoded.id);
        if (!admin) {
            return res
                .status(200)
                .json({ authenticated: false, message: "Admin not found" });
        }
        res.status(200).json({
            authenticated: true,
            admin: (0, mapAdmin_1.mapAdmin)(admin),
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
    try {
        const { admin, accessToken, refreshToken } = await (0, admin_1.registerAdmin)(req.body.login, req.body.password);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
            .status(201)
            .json({
            admin,
        });
    }
    catch (e) {
        res.status(401).send({ error: e.message || "Unknown Error" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { admin, accessToken, refreshToken } = await (0, admin_1.loginAdmin)(req.body.login, req.body.password);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, //15 minutes
        });
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        })
            .status(200)
            .json({
            admin: (0, mapAdmin_1.mapAdmin)(admin),
        });
    }
    catch (e) {
        res.status(401).send({ error: e.message || "Unknown Error" });
    }
});
router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ error: "No refresh token provided" });
        }
        const decoded = (0, token_1.verifyRefreshToken)(refreshToken);
        const admin = await Admin_1.Admin.findOne({
            _id: decoded.id,
            refreshToken,
        });
        if (!admin) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }
        const newAccessToken = (0, token_1.generateAccessToken)({ id: admin.id });
        const newRefreshToken = (0, token_1.generateRefreshToken)({ id: admin.id });
        await Admin_1.Admin.findByIdAndUpdate(admin._id, { refreshToken: newRefreshToken });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, //15 minutes
        });
        res
            .cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        })
            .status(200).json({ message: "Tokens refreshed successfully" });
    }
    catch (e) {
        res.status(401).json({ error: e.message });
    }
});
router.post("/logout", async (req, res) => {
    try {
        const adminId = req.admin?.id;
        if (adminId) {
            await Admin_1.Admin.findByIdAndUpdate(adminId, { refreshToken: null });
        }
        res.clearCookie("accessToken");
        res
            .clearCookie("refreshToken")
            .status(200)
            .json({ message: "Logged out successfully" });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
