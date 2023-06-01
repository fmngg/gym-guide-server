import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Hooks } from 'sequelize/types/hooks';
import { FavouritesExercise } from 'src/users/models/favouritesExercise.model';
import { User } from 'src/users/models/users.model';
import { Difficulty } from './difficulty.model';
import { Equipment } from './equipment.model';
import { MuscleGroup } from './muscle-group.model';
import { Rating } from './rating.model';

interface IExerciseCreationAttributes {
  name: string;
  description: string;
  image: string;
}

@Table({ tableName: 'exercises' })
export class Exercise extends Model<Exercise, IExerciseCreationAttributes> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING })
  image: string;

  @Column({ type: DataType.FLOAT(1), defaultValue: 0 })
  avgRating: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  views: number;

  @Column({ type: DataType.STRING, allowNull: true })
  recommended: string;

  @ForeignKey(() => Difficulty)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  difficultyId: number;

  @ForeignKey(() => Equipment)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  equipmentId: number;

  @ForeignKey(() => MuscleGroup)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  muscleGroupId: number;

  @BelongsTo(() => Difficulty)
  difficulty: Difficulty;

  @BelongsTo(() => Equipment)
  equipment: Equipment;

  @BelongsTo(() => MuscleGroup)
  muscleGroup: MuscleGroup;

  @HasMany(() => Rating, { onDelete: 'CASCADE' })
  rating: Rating;

  @HasMany(() => FavouritesExercise, { onDelete: 'CASCADE', hooks: true })
  favouritesExercise: FavouritesExercise;
}
