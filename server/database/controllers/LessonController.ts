import Lesson from '../models/Lesson';
import { Request, Response } from 'express';
import LessonType from '../models/LessonType';
import User from '../models/User';
import { Sequelize } from 'sequelize-typescript';
import Subject from '../models/Subject';
import jwt from 'jsonwebtoken';

export const createOld = async (req: Request, res: Response) => {
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

export const getTeachersLessonsOld = async (req: Request, res: Response) => {
  try {
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

export const getTeachersLessons = async (req: Request, res: Response) => {
  try {
    const { teacherInnerId } = req.body;
    const user = await User.findOne({ where: { teacherInnerId: teacherInnerId } });
    const teacherId = user?.dataValues.id;

    if (!teacherId) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const lessons = await Lesson.findAll({
      where: { teacherId: teacherId },
      raw: true,
    });

    // Массив с уроками по дням недели
    const formattedLessons: any[] = Array.from({ length: 7 }, (_) => new Map());

    // Заполнение массива с уроками
    for (const lesson of lessons) {
      const dayIndex = lesson.dayOfTheWeek - 1;

      const lesMap = formattedLessons[dayIndex];
      const student = (await User.findByPk(lesson.studentId)).dataValues;
      const studentInfo = {
        studentInnerId: student.studentInnerId, // поменять на норм атрибуты урока: studentInnerId, teacherInnerId, duration, comment, type и тд
        name: student.name,
        grade: student.grade,
        duration: lesson.duration,
        isOneTime: lesson.isOneTime
      };
      const time = lesson.startTime.slice(0, -3);
      if (lesMap.has(time)) {
        lesMap.get(time).push(studentInfo);
      } else {
        lesMap.set(time, [studentInfo]);
      }
    }
    // перевод Map в массив объектов вида {starttime, students}
    formattedLessons.forEach((lesson) => {
      lesson.lessons = Array.from(lesson.entries()).map(([starttime, students]: any) => ({
        starttime,
        students,
      }));
    });
    res.status(201).json({ timetable: formattedLessons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getThisTeachersLessons = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findByPk(decoded.id);
    const teacherId = user?.dataValues.id;

    if (!teacherId) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const lessons = await Lesson.findAll({
      where: { teacherId: teacherId },
      raw: true,
    });

    // Массив с уроками по дням недели
    const formattedLessons: any[] = Array.from({ length: 7 }, (_) => new Map());

    // Заполнение массива с уроками
    for (const lesson of lessons) {
      const dayIndex = lesson.dayOfTheWeek - 1;

      const lesMap = formattedLessons[dayIndex];
      const student = (await User.findByPk(lesson.studentId)).dataValues;
      const studentInfo = {
        studentInnerId: student.studentInnerId, // поменять на норм атрибуты урока: studentInnerId, teacherInnerId, duration, comment, type и тд
        name: student.name,
        grade: student.grade,
        duration: lesson.duration,
        comment: lesson.comment,
      };
      const time = lesson.startTime.slice(0, -3);
      if (lesMap.has(time)) {
        lesMap.get(time).push(studentInfo);
      } else {
        lesMap.set(time, [studentInfo]);
      }
    }
    // перевод Map в массив объектов вида {starttime, students}
    formattedLessons.forEach((lesson) => {
      lesson.lessons = Array.from(lesson.entries()).map(([starttime, students]: any) => ({
        starttime,
        students,
      }));
    });
    res.status(201).json({ timetable: formattedLessons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const lessonData = req.body;
    const lessonType = await LessonType.findOne({ where: { name: lessonData.type } });
    const subject = await Subject.findOne({ where: { name: lessonData.subject } });
    const student = await User.findOne({ where: { studentInnerId: lessonData.studentInnerId } });
    const teacher = await User.findOne({ where: { teacherInnerId: lessonData.teacherInnerId } });
    const newLesson = await Lesson.create({
      typeId: lessonType.id,
      studentId: student.id,
      teacherId: teacher.id,
      subjectId: subject.id,
      startTime: lessonData.startTime,
      dayOfTheWeek: lessonData.dayOfTheWeek,
      duration: lessonData.duration,
      comment: lessonData.comment,
      isOneTime: lessonData.isOneTime,
      isCanceled: false,
    });
    res.status(201).json({ lesson: newLesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
