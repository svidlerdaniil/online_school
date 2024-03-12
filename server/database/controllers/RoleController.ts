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
