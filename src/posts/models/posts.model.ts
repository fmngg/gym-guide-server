import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Category } from 'src/categories/models/categories';
import { Comment } from './comments.model';

interface IPostCreationAttributes {
  title: string;
  text: string;
  image: string;
}

@Table({ tableName: 'post' })
export class Post extends Model<Post, IPostCreationAttributes> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @Column({ type: DataType.STRING })
  image: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  views: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId: number;

  @HasMany(() => Comment, { onDelete: 'CASCADE' })
  comments: Comment;

  @BelongsTo(() => Category)
  category: Category;
}
