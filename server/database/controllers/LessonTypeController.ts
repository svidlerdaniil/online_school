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

export const getLessonTypes = async (req: Request, res: Response) => {
  try {
    const typesData = await LessonType.findAll({ attributes: ['name'], raw: true });
    const types = typesData.map((type) => type.name);
    res.status(200).json({ types: types });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
