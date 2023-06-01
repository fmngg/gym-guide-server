import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';
import { Exercise } from './excercises.model';

interface IRatingCreationAttributes {
  userId: number;
  exerciseId: number;
  rate: number;
}

@Table({ tableName: 'rating', updatedAt: false })
export class Rating extends Model<Rating, IRatingCreationAttributes> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  rate: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Exercise)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  exerciseId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Exercise)
  exercise: User;
}
