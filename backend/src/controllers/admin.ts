import { generateAccessToken, generateRefreshToken } from "../helpers/token";
import { Admin } from "../models/Admin";
import bcrypt from "bcrypt"

//admin

export async function registerAdmin(login:string, password:string) {
  if (!password) {
    throw new Error("Пароль не может быть пустым");
  }

  const existingAdmin = await Admin.findOne({ login });
  if (existingAdmin) {
    if (existingAdmin.login === login && existingAdmin.password === password) {
      throw new Error("Такой пользователь уже существует");
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await Admin.create({ login, password: passwordHash });
  const adminObject = admin.toObject();

  const accessToken = generateAccessToken({ id: admin.id, role: admin.role });
  const refreshToken = generateRefreshToken({ id: admin.id, role: admin.role });

  await Admin.findByIdAndUpdate(admin.id, { refreshToken });

  return {
    admin: adminObject,
    accessToken,
    refreshToken,
  };
}

export async function loginAdmin(login:string, password:string) {
  const admin = await Admin.findOne({ login });

  if (!admin) {
    throw new Error("Пользователь не найден");
  }

  const isPasswordMatch = await bcrypt.compare(password, admin.password);

  if (!isPasswordMatch) {
    throw new Error("Неверный пароль");
  }

  // Генерируем оба токена
  const accessToken = generateAccessToken({ id: admin.id, role: admin.role });
  const refreshToken = generateRefreshToken({ id: admin.id, role: admin.role });

  // Сохраняем refreshToken в БД
  await Admin.findByIdAndUpdate(admin.id, { refreshToken });

  return {
    admin,
    accessToken,
    refreshToken, // Отправляем клиенту для сохранения в localStorage
  };
}

