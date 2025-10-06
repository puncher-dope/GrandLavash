import express, { Response } from "express";
import { registerUser, loginUser } from "../controllers/user";
const router = express.Router({ mergeParams: true });
import { User } from "../models/User";
import { AuthRequest } from "../types/authAdminRequest";
import log from "../helpers/prettyLog";




router.post("/register", async (req, res) => {
  log("info", "Новая регистрация user");
  try {
    const { user} = await registerUser(
      req.body.login,
      req.body.phone
    );


    res
      .status(201)
      .json({user});
  } catch (e) {
    res.status(401).send({ error: e.message || "Unknown error" });
  }
});

router.post("/login", async (req, res) => {
  log("info", "Новый логин user");
  try {
    const { user } = await loginUser(
      req.body.login,
      req.body.phone
    );

    res
      .status(200)
      .json({
        user
      });
  } catch (e) {
    res.status(401).send({ error: e.message || "Unknown error" });
  }
});

// router.post("/refresh", async (req, res) => {
//   try {
//     const { refreshToken } = req.cookies;
//     if (!refreshToken) {
//       return res.status(401).json({ error: "No refresh token provided" });
//     }

//     // 1. Верифицируем refreshToken
//     const decoded = verifyRefreshToken(refreshToken) as UserData;

//     // 2. Проверяем существование пользователя и токена в БД
//     const user = await User.findOne({
//       _id: decoded.id,
//       refreshToken,
//     });

//     if (!user) {
//       return res.status(401).json({ error: "Invalid refresh token" });
//     }

//     // 3. Генерируем новые токены
//     const newAccessToken = generateAccessToken({ id: user.id });
//     const newRefreshToken = generateRefreshToken({ id: user.id });

//     // 4. Обновляем refreshToken в БД
//     await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

//     // 5. Возвращаем новые токены
//     res.cookie("accessToken", newAccessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 15 * 60 * 1000, //15 minutes
//     })
//     res
//       .cookie("refreshToken", newRefreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
//       })
//       .status(200).json({message: "Tokens refreshed successfully"});
//   } catch (e) {
//     res.status(401).json({ error: e.message });
//   }
// });

router.post("/logout", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: null });
    }

    res.clearCookie("accessToken")
    res
    .clearCookie('refreshToken')
    .status(200).json("Logged out successfully");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
