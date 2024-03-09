import { Table, Column, Model, DataType, HasOne, ForeignKey} from 'sequelize-typescript';
import User from './User';
@Table({
    tableName: "user",
    modelName: "User",
    timestamps: false
})
class Parent extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
    allowNull: false
  })
  declare id: string;
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false
  })
  declare userId: string;
  @HasOne(() => User, 'id')
  declare user: User;
};


export default Parent;