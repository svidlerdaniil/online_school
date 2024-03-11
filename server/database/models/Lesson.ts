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
} from 'sequelize-typescript';
import Role from './Role';
import Subject from './Subject';
import UserSubject from './UserSubject';
@Table({
  tableName: 'lesson',
  modelName: 'Lesson',
  timestamps: false,
})
class Lesson extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare typeId: string;
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare studentId: string;
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare teacherId: string;
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare subjectId: string;
  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  declare startTime: string;
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  declare dayOfTheWeek: number;
  @Column({
    type: DataType.REAL,
    allowNull: false,
  })
  declare duration: number;
  @Column({
    type: DataType.STRING,
  })
  declare comment: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isCanceled: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isOneTime: boolean;
}

export default Lesson;
