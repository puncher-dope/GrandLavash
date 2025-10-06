//admin
import express, { Response } from "express";
const router = express.Router({ mergeParams: true });
import jwt from "jsonwebtoken";

import { loginAdmin, registerAdmin } from "../controllers/admin"

import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/token";
import { Admin } from "../models/Admin";
import mapAdmin from '../helpers/mapAdmin'
import { AuthRequest } from "../types/authAdminRequest";


interface CustomJwtPayload extends jwt.JwtPayload {
  id: string;
  role?: number;
}

router.get("/checkAuth", async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && refreshToken) {
      return res.status(200).json({
        authenticated: false,
        shouldRefresh: true,
        message: "Access token expired, refresh required",
      });
    } else if (!accessToken) {
      return res
        .status(200)
        .json({ authenticated: false, message: "No access token" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET) as CustomJwtPayload
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res
        .status(200)
        .json({ authenticated: false, message: "Admin not found" });
    }

    res.status(200).json({
      authenticated: true,
      admin: mapAdmin(admin),
    });
  } catch (e) {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Говорим клиенту сделать refresh
      return res.status(200).json({
        authenticated: false,
        shouldRefresh: true,
        message: "Access token expired, refresh required",
      });
    }

    // Нет refresh token - полная деаутентификация
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken").status(200).json({
      authenticated: false,
      message: "Session expired",
    });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { admin, accessToken, refreshToken } = await registerAdmin(
      req.body.login,
      req.body.password
    );

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
      .status(201)
      .json({
        admin,
      });
  } catch (e) {
    res.status(401).send({ error: e.message || "Unknown Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { admin, accessToken, refreshToken } = await loginAdmin(
      req.body.login,
      req.body.password
    );

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
        admin: mapAdmin(admin),
      });
  } catch (e) {
    res.status(401).send({ error: e.message || "Unknown Error" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    // 1. Верифицируем refreshToken
    const decoded = verifyRefreshToken(refreshToken) as CustomJwtPayload

    // 2. Проверяем существование пользователя и токена в БД
    const admin = await Admin.findOne({
      _id: decoded.id,
      refreshToken,
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // 3. Генерируем новые токены
    const newAccessToken = generateAccessToken({ id: admin.id });
    const newRefreshToken = generateRefreshToken({ id: admin.id });

    // 4. Обновляем refreshToken в БД
    await Admin.findByIdAndUpdate(admin._id, { refreshToken: newRefreshToken });

    // 5. Возвращаем новые токены

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
      .status(200).json({message: "Tokens refreshed successfully"});
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.post("/logout", async (req:AuthRequest, res:Response) => {
  try {
    const adminId = req.admin?.id;
    if (adminId) {
      await Admin.findByIdAndUpdate(adminId, { refreshToken: null });
    }

    res.clearCookie("accessToken");
    res
      .clearCookie("refreshToken")
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
