import { Request, Response } from 'express';
import Role from '../models/Role';
import User from '../models/User';

export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const role = await Role.create({ name });
    res.status(201).json({ role: role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const roleId = (await Role.findOne({ where: { name: 'преподаватель' } })).dataValues.id;
    const teachers = await User.findAll({
      where: { roleId: roleId },
      attributes: ['id', 'name', 'phoneNumber'],
    });
    res.status(201).json({ teachers: teachers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
