import Lesson from '../models/Lesson';
import { Request, Response } from 'express';
import LessonType from '../models/LessonType';
import User from '../models/User';

export const create = async (req: Request, res: Response) => {
  try {
    const {
      type,
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
    const typeId = (await LessonType.findOne({ where: { name: type } })).dataValues.id;
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

export const getTeachersLessons = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { teacherInnerId } = req.body;
    const teacherId = (await User.findOne({ where: { teacherInnerId: teacherInnerId } })).dataValues
      .id;
    const lessons = await Lesson.findAll({
      where: { teacherId: teacherId },
    });
    res.status(201).json({ lessons: lessons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
