import { Table, Column, Model, DataType, ForeignKey} from 'sequelize-typescript';
import Parent from './Parent';
@Table({
    tableName: "user",
    modelName: "User",
    timestamps: false
})
class User extends Model {
  @ForeignKey(() => Parent)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
    allowNull: false
  })
  declare id: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false
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
};


export default User;