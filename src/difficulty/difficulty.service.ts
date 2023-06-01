import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Difficulty } from 'src/exercises/models/difficulty.model';
import { DifficultytDto } from './dto/difficulty.dto';

@Injectable()
export class DifficultyService {
  constructor(@InjectModel(Difficulty) private difficultyRepository: typeof Difficulty) {}

  async createDifficulty(dto: DifficultytDto) {
    try {
      const isExist = await this.difficultyRepository.findOne({
        where: { name: dto.name },
      });

      if (isExist) {
        return { message: 'Запись с таким именем уже есть' };
      }

      const difficulty = await this.difficultyRepository.create(dto);
      return difficulty;
    } catch (error) {
      throw new ForbiddenException({ message: 'Не удалось создать' });
    }
  }

  async getAllDifficulties() {
    try {
      const difficulty = await this.difficultyRepository.findAll();
      return difficulty;
    } catch (error) {
      throw new NotFoundException({ message: 'Не удалось найти' });
    }
  }
}
