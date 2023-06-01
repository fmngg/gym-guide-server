import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/models/users.model';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from 'src/files/files.module';
import { Comment } from './models/comments.model';
import { FilesService } from 'src/files/files.service';
import { Post } from './models/posts.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    FilesModule,
    UsersModule,
    SequelizeModule.forFeature([User, Comment, Post]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'privateKey',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
})
export class PostsModule {}
