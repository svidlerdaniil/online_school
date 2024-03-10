import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasOne,
  BelongsTo,
} from 'sequelize-typescript';
import Parent from './Parent';
import Role from './Role';
@Table({
  tableName: 'user',
  modelName: 'User',
  timestamps: false,
})
class User extends Model {
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
  @HasOne(() => Parent, 'userId')
  declare parent: Parent;
  @BelongsTo(() => Role, { foreignKey: 'roleId', as: 'role' }) // Fix the foreignKey name here
  declare role: Role;
}

export default User;
