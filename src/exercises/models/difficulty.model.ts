import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';
import { Equipment } from './equipment.model';
import { Exercise } from './excercises.model';

interface IDifficultyCreationAttributes {
  name: string;
}

@Table({ tableName: 'difficulty', createdAt: false, updatedAt: false })
export class Difficulty extends Model<Difficulty, IDifficultyCreationAttributes> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @HasMany(() => Exercise)
  exercise: Exercise;
}
