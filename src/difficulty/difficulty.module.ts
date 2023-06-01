import { Module } from '@nestjs/common';
import { DifficultyService } from './difficulty.service';
import { DifficultyController } from './difficulty.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Difficulty } from 'src/exercises/models/difficulty.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [DifficultyController],
  providers: [DifficultyService],
  imports: [
    SequelizeModule.forFeature([Difficulty]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'privateKey',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  exports: [DifficultyService],
})
export class DifficultyModule {}
