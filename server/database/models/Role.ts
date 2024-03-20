import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import User from './User';
@Table({
  tableName: 'role',
  modelName: 'Role',
  timestamps: false,
})
class Role extends Model {
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
  @HasMany(() => User, 'roleId')
  declare users: User[];
}

export default Role;
