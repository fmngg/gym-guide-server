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

interface IMuscleGroupCreationAttributes {
  name: string;
}

@Table({ tableName: 'muscle-group', createdAt: false, updatedAt: false })
export class MuscleGroup extends Model<MuscleGroup, IMuscleGroupCreationAttributes> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @HasMany(() => Exercise)
  exercise: Exercise;
}
