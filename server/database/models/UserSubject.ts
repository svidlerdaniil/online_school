import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import User from './User';
import Subject from './Subject';

@Table({
  tableName: 'userSubject',
  modelName: 'UserSubject',
  timestamps: false,
})
class UserSubject extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare subjectId: string;

  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  declare maxGrade: number;
}

export default UserSubject;
