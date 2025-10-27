import express, { Response } from "express";
import { registerUser, loginUser } from "../controllers/user";
const router = express.Router({ mergeParams: true });
import { User } from "../models/User";
import { AuthRequest } from "../types/authAdminRequest";
import log from "../helpers/prettyLog";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../helpers/token";
import { UserData } from "../types/userType";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "./adminRoute";

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

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    ) as CustomJwtPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(200)
        .json({ authenticated: false, message: "User not found" });
    }

    res.status(200).json({
      authenticated: true,
      user: user,
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
  log("info", "Новая регистрация user");
  try {
    const { user, accessToken, refreshToken } = await registerUser(
      req.body.login,
      req.body.phone
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain:
        process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
      path: "/", // ✅ ЯВНО УКАЖИТЕ PATH
      maxAge: 15 * 60 * 1000, //15 minutes
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain:
          process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
        path: "/", // ✅ ЯВНО УКАЖИТЕ PATH
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      })
      .status(201)
      .json({ user });
  } catch (e) {
    res.status(401).send({ error: e.message || "Unknown error" });
  }
});

router.post("/login", async (req, res) => {
  log("info", "Новый логин user");
  try {
    const { user, accessToken, refreshToken } = await loginUser(
      req.body.login,
      req.body.phone
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain:
        process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
      path: "/", // ✅ ЯВНО УКАЖИТЕ PATH
      maxAge: 15 * 60 * 1000, //15 minutes
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain:
          process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
        path: "/", // ✅ ЯВНО УКАЖИТЕ PATH
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      })
      .status(200)
      .json({
        user,
      });
  } catch (e) {
    res.status(401).send({ error: e.message || "Unknown error" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    // 1. Верифицируем refreshToken
    const decoded = verifyRefreshToken(refreshToken) as UserData;

    // 2. Проверяем существование пользователя и токена в БД
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // 3. Генерируем новые токены
    const newAccessToken = generateAccessToken({ id: user.id });
    const newRefreshToken = generateRefreshToken({ id: user.id });

    // 4. Обновляем refreshToken в БД
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

    // 5. Возвращаем новые токены
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain:
        process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
      path: "/", // ✅ ЯВНО УКАЖИТЕ PATH
      maxAge: 15 * 60 * 1000, //15 minutes
    });
    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain:
          process.env.NODE_ENV === "production" ? ".railway.app" : "localhost",
        path: "/", // ✅ ЯВНО УКАЖИТЕ PATH
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      })
      .status(200)
      .json({ message: "Tokens refreshed successfully" });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.post("/logout", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: null });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken").status(200).json("Logged out successfully");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
