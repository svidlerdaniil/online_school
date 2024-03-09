import express, { Express, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import sequelize from './database/connection';
import jwt from "jsonwebtoken";
import { registerValidator } from './validations/auth';
import { Result, validationResult } from 'express-validator';

config();

const app: Express = express();
const port: Number = Number(process.env.PORT);
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Сервак');
});

app.post('/auth/register', registerValidator, (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  res.json({
    success: true,
  })
})

app.post('/auth/login', (req: Request, res: Response) => {
  token: String = jwt.sign({
    password: String = req.body.password
  },
  process.env.SECRET_KEY);
})

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
