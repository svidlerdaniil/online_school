import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  ForeignKey,
  BelongsTo,
  HasMany,
  AutoIncrement,
  BelongsToMany,
} from 'sequelize-typescript';
import Lesson from './Lesson';
@Table({
  tableName: 'lessonType',
  modelName: 'LessonType',
  timestamps: false,
})
class LessonType extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
  })
  declare name: string;
  @HasMany(() => Lesson, 'typeId')
  declare lessons: Lesson[];
}

export default LessonType;
