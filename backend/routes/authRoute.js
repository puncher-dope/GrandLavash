const express = require("express");
const {
  register,
  login,
} = require("../controllers/user");
const router = express.Router({ mergeParams: true });
const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/token");
const User = require("../models/User");



router.post("/register", async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await register(
      req.body.login,
      req.body.phone
    );

    res.cookie("accessToken", accessToken, { httpOnly: true }).status(201).json({
      user,
      refreshToken, // Клиент должен сохранить его в localStorage
    });
  } catch (e) {
    res.status(400);
    res.send({ error: e.message || "Unknown error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await login(
      req.body.login,
      req.body.phone
    );

    res.cookie("accessToken", accessToken, { httpOnly: true }).status(200).json({
      user,
      refreshToken,
    });
  } catch (e) {
    res.status(401).send({ error: e.message || "Unknown error" });
  }
});



router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // 1. Верифицируем refreshToken
    const decoded = verifyRefreshToken(refreshToken);

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
    await User.findByIdAndUpdate(user.id, { refreshToken: newRefreshToken });

    // 5. Возвращаем новые токены
    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 минут
      })
      .json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: null });
    }

    res.clearCookie("accessToken").status(200).json("Logged out successfully");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
  res.status(200).clearCookie("accessToken").send({ user: null });
});

module.exports = router;
