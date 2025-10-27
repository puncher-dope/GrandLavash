"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdmin = registerAdmin;
exports.loginAdmin = loginAdmin;
const token_1 = require("../helpers/token");
const Admin_1 = require("../models/Admin");
const bcrypt_1 = __importDefault(require("bcrypt"));
//admin
async function registerAdmin(login, password) {
    if (!password) {
        throw new Error("Пароль не может быть пустым");
    }
    const existingAdmin = await Admin_1.Admin.findOne({ login });
    if (existingAdmin) {
        if (existingAdmin.login === login && existingAdmin.password === password) {
            throw new Error("Такой пользователь уже существует");
        }
    }
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const admin = await Admin_1.Admin.create({ login, password: passwordHash });
    const adminObject = admin.toObject();
    const accessToken = (0, token_1.generateAccessToken)({ id: admin.id, role: admin.role });
    const refreshToken = (0, token_1.generateRefreshToken)({ id: admin.id, role: admin.role });
    await Admin_1.Admin.findByIdAndUpdate(admin.id, { refreshToken });
    return {
        admin: adminObject,
        accessToken,
        refreshToken,
    };
}
async function loginAdmin(login, password) {
    const admin = await Admin_1.Admin.findOne({ login });
    if (!admin) {
        throw new Error("Пользователь не найден");
    }
    const isPasswordMatch = await bcrypt_1.default.compare(password, admin.password);
    if (!isPasswordMatch) {
        throw new Error("Неверный пароль");
    }
    // Генерируем оба токена
    const accessToken = (0, token_1.generateAccessToken)({ id: admin.id, role: admin.role });
    const refreshToken = (0, token_1.generateRefreshToken)({ id: admin.id, role: admin.role });
    // Сохраняем refreshToken в БД
    await Admin_1.Admin.findByIdAndUpdate(admin.id, { refreshToken });
    return {
        admin,
        accessToken,
        refreshToken, // Отправляем клиенту для сохранения в localStorage
    };
}
