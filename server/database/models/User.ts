import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasOne,
  BelongsTo,
  AutoIncrement,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import Role from './Role';
import Subject from './Subject';
import UserSubject from './UserSubject';
import Lesson from './Lesson';
@Table({
  tableName: 'user',
  modelName: 'User',
  timestamps: false,
})
class User extends Model {
  @AutoIncrement
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare phoneNumber: Number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare login: string;
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare passwordHash: string;
  @Column({
    type: DataType.STRING,
  })
  declare name: string;
  @Column({
    type: DataType.SMALLINT,
  })
  declare grade: number;
  @Column({
    type: DataType.INTEGER,
    unique: true,
  })
  declare studentInnerId: number;
  @Column({
    type: DataType.INTEGER,
    unique: true,
  })
  declare teacherInnerId: number;
  @Column({
    type: DataType.STRING,
  })
  declare info: string;

  @BelongsTo(() => User, { foreignKey: 'parentId', as: 'parent' })
  declare parent: User;

  @BelongsTo(() => Role, { foreignKey: 'roleId', as: 'role' })
  declare role: string;

  @BelongsToMany(() => Subject, () => UserSubject)
  declare subjects: Subject[];

  @HasMany(() => Lesson, 'teacherId')
  declare teacherLessons: Lesson[];

  @HasMany(() => Lesson, 'studentId')
  declare studentLessons: Lesson[];
}

export default User;
