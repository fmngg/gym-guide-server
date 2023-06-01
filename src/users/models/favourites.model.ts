import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { FavouritesExercise } from './favouritesExercise.model';
import { User } from './users.model';

interface IFavouritesCreationAttributes {
  userId: number;
}

@Table({ tableName: 'favourites', createdAt: false, updatedAt: false })
export class Favourites extends Model<Favourites, IFavouritesCreationAttributes> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @HasMany(() => FavouritesExercise)
  favouritesExercise: FavouritesExercise;

  @BelongsTo(() => User)
  user: User;
}
