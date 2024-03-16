import { Request, Response } from 'express';
import Role from '../models/Role';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import Lesson from '../models/Lesson';

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
      attributes: ['teacherInnerId', 'name', 'phoneNumber'],
    });
    res.status(201).json({ teachers: teachers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const roleId = (await Role.findOne({ where: { name: 'ученик' } })).dataValues.id;
    const students = await User.findAll({
      where: { roleId: roleId },
      attributes: ['studentInnerId', 'name', 'phoneNumber', 'grade', 'info', 'parentId'],
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['name', 'phoneNumber'],
        },
      ],
    });
    let studentsWithParents = [];
    for (const student of students) {
      const parent = await student.parent;
      studentsWithParents.push({
        studentInnerId: student.studentInnerId,
        name: student.name,
        phoneNumber: student.phoneNumber,
        grade: student.grade,
        info: student.info,
        parentName: parent.name,
        parentPhoneNumber: parent.phoneNumber,
      });
    }
    res.status(201).json({ students: studentsWithParents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getThisTeacherStudents = async (req: Request, res: Response) => {
  try {
    const students = [];
    const token = req.header('token');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const teacher = await User.findByPk(decoded.id);
    const lessons = await Lesson.findAll({
      where: { teacherId: teacher.dataValues.id },
      raw: true,
      attributes: ['studentId'],
    });
    const uniqueStudentIds = Array.from(new Set(lessons.map((obj) => obj.studentId)));
    for (const id of uniqueStudentIds) {
      const student = await User.findByPk(id, {
        attributes: ['studentInnerId', 'name', 'phoneNumber', 'grade', 'info', 'parentId'],
        include: [
          {
            model: User,
            as: 'parent',
            attributes: ['name', 'phoneNumber'],
          },
        ],
      });
      students.push(student);
    }
    const studentsWithParents = [];
    for (const student of students) {
      const parent = await student.parent;
      studentsWithParents.push({
        studentInnerId: student.studentInnerId,
        name: student.name,
        phoneNumber: student.phoneNumber,
        grade: student.grade,
        info: student.info,
        parentName: parent.name,
        parentPhoneNumber: parent.phoneNumber,
      });
    }
    res.status(201).json({ students: studentsWithParents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
