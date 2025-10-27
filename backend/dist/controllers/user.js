"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const User_1 = require("../models/User");
const token_1 = require("../helpers/token");
// register user
async function registerUser(login, phone) {
    if (!login || !phone) {
        throw new Error("Все поля обязательны");
    }
    const existingUser = await User_1.User.findOne({
        $or: [{ login }, { phone }],
    });
    if (existingUser) {
        if (existingUser.login === login && existingUser.phone === phone) {
            throw new Error("Пользователь с таким логином и номером телефона уже существует");
        }
    }
    const user = await User_1.User.create({ login, phone });
    const userObject = user.toObject();
    // Генерируем оба токена
    const accessToken = (0, token_1.generateAccessToken)({ id: user.id, role: user.role });
    const refreshToken = (0, token_1.generateRefreshToken)({ id: user.id, role: user.role });
    // Сохраняем refreshToken в БД
    await User_1.User.findByIdAndUpdate(user.id, { refreshToken });
    return {
        user: userObject,
        accessToken,
        refreshToken, // Отправляем клиенту для сохранения в localStorage
    };
}
//login
async function loginUser(login, phone) {
    const user = await User_1.User.findOne({ $or: [{ login }, { phone }] });
    if (!user) {
        throw new Error("Пользователь не найден");
    }
    // Генерируем оба токена
    const accessToken = (0, token_1.generateAccessToken)({ id: user.id, role: user.role });
    const refreshToken = (0, token_1.generateRefreshToken)({ id: user.id, role: user.role });
    // Сохраняем refreshToken в БД
    await User_1.User.findByIdAndUpdate(user.id, { refreshToken });
    return {
        user,
        accessToken,
        refreshToken, // Отправляем клиенту для сохранения в localStorage
    };
}
