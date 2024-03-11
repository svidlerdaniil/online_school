import { Request, Response } from 'express';
import User from '../models/User';
import UserSubject from '../models/UserSubject';
import Subject from '../models/Subject';
import bcrypt from 'bcrypt';
import Role from '../models/Role';

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, login, password, name, subjects } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const roleId = (await Role.findOne({ where: { name: 'преподаватель' } })).id;
    const newUser = await User.create({
      phoneNumber,
      login,
      passwordHash,
      name,
      roleId,
    });
    for (const subjectObj of subjects) {
      const subjectId = (await Subject.findOne({ where: { name: subjectObj.name } })).id;
      await UserSubject.create({
        userId: newUser.dataValues.id,
        subjectId: subjectId,
        maxGrade: subjectObj.maxGrade,
      });
    }

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, login, password, name, subjects, grade, parentId, studentInnerId } =
      req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const roleId = (await Role.findOne({ where: { name: 'ученик' } })).id;
    const newUser = await User.create({
      phoneNumber,
      login,
      passwordHash,
      name,
      roleId,
      grade,
      parentId,
      studentInnerId,
    });
    for (const subjectObj of subjects) {
      const subjectId = (await Subject.findOne({ where: { name: subjectObj.name } })).id;
      await UserSubject.create({
        userId: newUser.dataValues.id,
        subjectId: subjectId,
      });
    }

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
