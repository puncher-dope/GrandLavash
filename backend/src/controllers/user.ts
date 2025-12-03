

import {User} from '../models/User'
import {generateAccessToken,
  generateRefreshToken} from '../helpers/token'

// register user

export async function registerUser(login: string, phone: string) {
  if (!login || !phone) {
    throw new Error("Все поля обязательны");
  }

  const existingUser = await User.findOne({
    $or: [{ login }, { phone }],
  });
  if (existingUser) {
    if (existingUser.login === login && existingUser.phone === phone) {
      throw new Error("Пользователь с таким логином и номером телефона уже существует")
    }
  }

  const user = await User.create({ login, phone });
  const userObject = user.toObject();

  const accessToken = generateAccessToken({id: user.id, role: user.role});
  const refreshToken = generateRefreshToken({id: user.id, role: user.role});

 
  await User.findByIdAndUpdate(user.id, { refreshToken });

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
}



//login
export async function loginUser(login: string, phone: string) {
  const user = await User.findOne({ $or: [{ login }, { phone }] });
  if(!user){
    throw new Error("Пользователь не найден");
  }


  const accessToken = generateAccessToken({id: user.id, role: user.role});
  const refreshToken = generateRefreshToken({id: user.id, role: user.role});


  await User.findByIdAndUpdate(user.id, { refreshToken });

  return {
    user,
    accessToken,
    refreshToken,
  };
}

