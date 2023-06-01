import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';
import { Exercise } from './excercises.model';

interface IEquipmentCreationAttributes {
  name: string;
}

@Table({ tableName: 'equipment', createdAt: false, updatedAt: false })
export class Equipment extends Model<Equipment, IEquipmentCreationAttributes> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @HasMany(() => Exercise)
  exercise: Exercise;
}
