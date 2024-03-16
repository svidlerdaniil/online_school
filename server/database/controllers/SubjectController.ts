import { Request, Response } from 'express';
import Subject from '../models/Subject';
import User from '../models/User';
import UserSubject from '../models/UserSubject';
import jwt from 'jsonwebtoken';

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

export const getTeacherSubjects = async (req: Request, res: Response) => {
  try {
    const teacherInnerId = req.body.teacherInnerId;
    const teacher = await User.findOne({ where: { teacherInnerId: teacherInnerId }, raw: true });

    const userSubjects = await UserSubject.findAll({ where: { userId: teacher.id }, raw: true });

    const subjectPromises = userSubjects.map(async (obj) => {
      const subject = await Subject.findOne({ where: { id: obj.subjectId }, raw: true });
      return subject.name;
    });
    res.status(200).json({ subjects: await Promise.all(subjectPromises) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getThisTeacherSubjects = async (req: Request, res: Response) => {
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
    const teacher = await User.findByPk(teacherId);

    const userSubjects = await UserSubject.findAll({
      where: { userId: teacher.dataValues.id },
      raw: true,
    });

    const subjectPromises = userSubjects.map(async (obj) => {
      const subject = await Subject.findOne({ where: { id: obj.subjectId }, raw: true });
      return subject.name;
    });
    res.status(200).json({ subjects: await Promise.all(subjectPromises) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
