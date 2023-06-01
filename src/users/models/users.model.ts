import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table, DataType, ForeignKey, HasMany, HasOne } from 'sequelize-typescript';
import { Exercise } from 'src/exercises/models/excercises.model';
import { Rating } from 'src/exercises/models/rating.model';
import { Comment } from 'src/posts/models/comments.model';
import { Favourites } from './favourites.model';

interface IUserCreationAttributes {
  name: string;
  email: string;
  password: string;
  img?: string;
  favourites?: object[];
}

@Table({ tableName: 'users' })
export class User extends Model<User, IUserCreationAttributes> {
  @ApiProperty({ example: '1' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'Ilya' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @ApiProperty({ example: 'ilyafomin@mail.ru' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: '12345678' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: 'ADMIN' })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'USER' })
  role: string;

  @ApiProperty({ example: 'img.jpg' })
  @Column({ type: DataType.STRING, allowNull: true })
  img: string;

  @HasOne(() => Favourites)
  favourites: Favourites;

  @HasMany(() => Rating)
  rating: Rating;

  @HasMany(() => Comment)
  comments: Comment;
}
