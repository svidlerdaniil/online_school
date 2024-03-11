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
import User from './User';
import UserSubject from './UserSubject';
@Table({
  tableName: 'subject',
  modelName: 'Subject',
  timestamps: false,
})
class Subject extends Model {
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
  @BelongsToMany(() => User, () => UserSubject)
  declare users: User[];
}

export default Subject;
