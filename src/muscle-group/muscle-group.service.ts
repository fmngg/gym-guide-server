import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MuscleGroup } from 'src/exercises/models/muscle-group.model';
import { MuscleGrouptDto } from './dto/muscle-group.dto';

@Injectable()
export class MuscleGroupService {
  constructor(@InjectModel(MuscleGroup) private muscleGroupRepository: typeof MuscleGroup) {}

  async createMuscleGroup(dto: MuscleGrouptDto) {
    try {
      const isExist = await this.muscleGroupRepository.findOne({
        where: { name: dto.name },
      });

      if (isExist) {
        return { message: 'Запись с таким именем уже есть' };
      }

      const muscleGroup = await this.muscleGroupRepository.create(dto);
      return muscleGroup;
    } catch (error) {
      throw new ForbiddenException({ message: 'Не удалось создать' });
    }
  }

  async getAllMuscleGroups() {
    try {
      const muscleGroup = await this.muscleGroupRepository.findAll({ order: [['name', 'ASC']] });
      return muscleGroup;
    } catch (error) {
      throw new NotFoundException({ message: 'Не удалось найти' });
    }
  }
}
