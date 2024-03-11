import { Request, Response } from 'express';
import LessonType from '../models/LessonType';

export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const role = await LessonType.create({ name });
    res.status(201).json({ role: role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
