import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './database/models/User';
import { config } from 'dotenv';
import Role from './database/models/Role';

config();

export const registerParent = async (req: Request, res: Response) => {
  try {
    const { name, phone, login, password, role }: any = req.body;
    const requestingUserToken = req.headers['authorization'];
    const decodedToken = jwt.decode(requestingUserToken);
    const requestingUserRole = decodedToken?.role;
    console.log(requestingUserRole);
    const registrationPermissions = {
      undefined: ['родитель'],
      admin: ['менеджер', 'преподаватель'],
      manager: ['родитель', 'ученик'],
      parent: [],
    };
    if (!registrationPermissions[requestingUserRole].includes(role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    const candidate = await User.findOne({ where: { login: login } });
    if (candidate) {
      return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
    }
    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    // Создание пользователя
    const roleId = await Role.findOne({ where: { name: role } });
    const user = await User.create({
      name,
      phoneNumber: phone.replace(/\D/g, ''), // удаляем +
      login,
      passwordHash: hashedPassword,
      roleId: roleId.id,
    });
    // Генерация JWT токена
    const token = generateAccessToken(user.id, role);

    res.json({ token: token, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({
      where: { login: login },
      include: [{ model: Role, as: 'role' }],
    });
    if (!user) {
      return res.status(400).json({ message: `Пользователь ${login} не найден` });
    } else {
    }
    const validPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ message: `Введен неверный пароль` });
    }
    const token = generateAccessToken(user.id, user.role);
    console.log(token);
    return res.json({ user: user, token: token });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Login error' });
  }
};

const generateAccessToken = (id, role) => {
  const payload = {
    id,
    role,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
};
