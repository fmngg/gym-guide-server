import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Equipment } from 'src/exercises/models/equipment.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [EquipmentController],
  providers: [EquipmentService],
  imports: [
    SequelizeModule.forFeature([Equipment]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'privateKey',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  exports: [EquipmentService],
})
export class EquipmentModule {}
