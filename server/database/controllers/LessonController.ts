import Lesson from '../models/Lesson';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response) => {
  try {
    const {
      typeId,
      studentId,
      teacherId,
      subjectId,
      startTime,
      dayOfTheWeek,
      duration,
      comment,
      isCanceled,
      isOneTime,
    } = req.body;

    const newLesson = await Lesson.create({
      typeId,
      studentId,
      teacherId,
      subjectId,
      startTime,
      dayOfTheWeek,
      duration,
      comment,
      isCanceled,
      isOneTime,
    });

    res.status(201).json({ lesson: newLesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
