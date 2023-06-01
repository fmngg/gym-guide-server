import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ExercisesModule } from './exercises/exercises.module';
import { Exercise } from './exercises/models/excercises.model';
import { User } from './users/models/users.model';
import { Favourites } from './users/models/favourites.model';
import { FavouritesExercise } from './users/models/favouritesExercise.model';
import { Difficulty } from './exercises/models/difficulty.model';
import { Equipment } from './exercises/models/equipment.model';
import { Rating } from './exercises/models/rating.model';
import { AuthModule } from './auth/auth.module';
import { DifficultyModule } from './difficulty/difficulty.module';
import { EquipmentModule } from './equipment/equipment.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PostsModule } from './posts/posts.module';
import * as path from 'path';
import { Post } from './posts/models/posts.model';
import { Comment } from './posts/models/comments.model';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/models/categories';
import { MuscleGroupModule } from './muscle-group/muscle-group.module';
import { MuscleGroup } from './exercises/models/muscle-group.model';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: path.resolve(__dirname, '..', 'static/exercises'),
        renderPath: '/exercises',
      },
      {
        rootPath: path.resolve(__dirname, '..', 'static/users'),
        renderPath: '/users',
      },
      {
        rootPath: path.resolve(__dirname, '..', 'static/posts'),
        renderPath: '/posts',
      },
    ),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        Exercise,
        User,
        Favourites,
        FavouritesExercise,
        Difficulty,
        Equipment,
        Rating,
        Post,
        Comment,
        Category,
        MuscleGroup,
      ],
      autoLoadModels: true,
    }),
    UsersModule,
    ExercisesModule,
    AuthModule,
    DifficultyModule,
    EquipmentModule,
    FilesModule,
    PostsModule,
    CategoriesModule,
    MuscleGroupModule,
  ],
})
export class AppModule {}
