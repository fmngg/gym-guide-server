import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { Category } from './models/categories';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    SequelizeModule.forFeature([Category]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'privateKey',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
})
export class CategoriesModule {}
