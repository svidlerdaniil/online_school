import express, { Express, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import sequelize from './database/connection';
import jwt from 'jsonwebtoken';
import { registerValidator } from './validations/auth';
import { Result, check, validationResult } from 'express-validator';
import { login, registerParent } from './authController';
import {
  LessonController,
  RoleController,
  UserController,
  SubjectController,
  LessonTypeController,
} from './database/controllers';
import { checkRole } from './middleware/rolemiddleware';

config();

const app: Express = express();
const port: Number = Number(process.env.PORT);
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Сервак');
});

app.post('/auth/register', registerParent);

app.post('/auth/login', login);

app.post('/roles/create', RoleController.create); // удалить потом
app.post('/users/teacher/create', checkRole(['менеджер']), UserController.createTeacher); // заменить данные на норм
app.post('/users/student/create', checkRole(['менеджер']), UserController.createStudent); // заменить данные на норм
app.post('/subjects/create', checkRole(['менеджер']), SubjectController.create); // поменять на админа
app.post('/lessontype/create', checkRole(['менеджер']), LessonTypeController.create); // поменять на админа
app.post('/lessons/create', checkRole(['менеджер']), LessonController.create);
app.post('/users/student/edit', checkRole(['менеджер']), UserController.editStudent);
app.post('/users/teacher/getlessons', checkRole(['менеджер']), LessonController.getTeachersLessons);
app.post(
  '/users/teacher/getsubjects',
  checkRole(['менеджер']),
  SubjectController.getTeacherSubjects,
);

app.get('/roles/teacher/get', checkRole(['менеджер']), RoleController.getAllTeachers);
app.get('/roles/students/get', checkRole(['менеджер']), RoleController.getAllStudents);
app.get('/lessontypes/get', checkRole(['менеджер']), LessonTypeController.getLessonTypes);
app.get(
  '/users/teacher/thisteacherslessons',
  checkRole(['преподаватель']),
  LessonController.getThisTeachersLessons,
);
app.get(
  '/users/teacher/thisteacherssubjects',
  checkRole(['преподаватель']),
  SubjectController.getThisTeacherSubjects,
);
app.get(
  '/users/teacher/thisteachersstudents',
  checkRole(['преподаватель']),
  RoleController.getThisTeacherStudents,
);
// app.get('/items', MenuItemController.getAll);
// app.get('/items/:id', MenuItemController.getOne);
// app.post('/items', MenuItemController.create);

// app.get('/categories', ItemCategoryController.getAll);
// app.get('/categories/:id', ItemCategoryController.getOne);
// app.post('/categories', ItemCategoryController.create);

app.listen(port, () => {
  console.log(`Сервер запущен http://localhost:${port}`);
});

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Успешно установлено соединение с БД');
  } catch (error) {
    console.error('Ошибка при соединении с:', error);
  }
}

testDatabaseConnection();
