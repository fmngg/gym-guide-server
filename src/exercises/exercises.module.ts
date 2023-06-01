import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Exercise } from './models/excercises.model';
import { Difficulty } from './models/difficulty.model';
import { Equipment } from './models/equipment.model';
import { Rating } from './models/rating.model';
import { JwtModule } from '@nestjs/jwt';
import { FavouritesExercise } from 'src/users/models/favouritesExercise.model';
import { Favourites } from 'src/users/models/favourites.model';
import { User } from 'src/users/models/users.model';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';
import { MuscleGroupModule } from 'src/muscle-group/muscle-group.module';
import { DifficultyModule } from 'src/difficulty/difficulty.module';
import { EquipmentModule } from 'src/equipment/equipment.module';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService],
  imports: [
    FilesModule,
    DifficultyModule,
    EquipmentModule,
    MuscleGroupModule,
    SequelizeModule.forFeature([
      Exercise,
      Difficulty,
      Equipment,
      Rating,
      Favourites,
      FavouritesExercise,
      User,
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'privateKey',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
})
export class ExercisesModule {}
