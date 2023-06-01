import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Post } from 'src/posts/models/posts.model';
import { User } from 'src/users/models/users.model';

interface ICategoryCreationAttributes {
  name: string;
}

@Table({ tableName: 'category', createdAt: false, updatedAt: false })
export class Category extends Model<Category, ICategoryCreationAttributes> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @HasMany(() => Post)
  Post: Post;
}
