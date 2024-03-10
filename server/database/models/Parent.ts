import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo} from 'sequelize-typescript';
import User from './User';
@Table({
    tableName: "parent",
    modelName: "Parent",
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
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false
  })
  declare userId: string;
};


export default Parent;