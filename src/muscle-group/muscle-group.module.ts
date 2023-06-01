import { Module } from '@nestjs/common';
import { MuscleGroupService } from './muscle-group.service';
import { MuscleGroupController } from './muscle-group.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { MuscleGroup } from 'src/exercises/models/muscle-group.model';

@Module({
  controllers: [MuscleGroupController],
  providers: [MuscleGroupService],
  imports: [
    SequelizeModule.forFeature([MuscleGroup]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'privateKey',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  exports: [MuscleGroupService],
})
export class MuscleGroupModule {}
