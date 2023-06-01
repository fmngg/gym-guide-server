import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Exercise } from 'src/exercises/models/excercises.model';
import { Favourites } from './favourites.model';

interface IFavouritesExerciseCreationAttributes {
  favouritesId: number;
  exerciseId: number;
}

@Table({ tableName: 'favourites_exercise' })
export class FavouritesExercise extends Model<
  FavouritesExercise,
  IFavouritesExerciseCreationAttributes
> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Favourites)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  favouritesId: number;

  @ForeignKey(() => Exercise)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  exerciseId: number;

  @BelongsTo(() => Favourites)
  favourites: Favourites;

  @BelongsTo(() => Exercise, { onDelete: 'CASCADE' })
  exercise: Favourites;
}
