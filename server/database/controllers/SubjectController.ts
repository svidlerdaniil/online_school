import { Request, Response } from 'express';
import Subject from '../models/Subject';

export const create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const subject = await Subject.create({ name });
      res.status(201).json({ subject: subject });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };