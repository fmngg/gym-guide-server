import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';
import { Post } from './posts.model';

interface ICommentCreationAttributes {
  userId: number;
  userName: string;
  userImage: string;
  postId: number;
  text: string;
}

@Table({ tableName: 'comment', updatedAt: false })
export class Comment extends Model<Comment, ICommentCreationAttributes> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  text: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userName: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userImage: string;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  postId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Post, { onDelete: 'CASCADE' })
  post: User;
}
