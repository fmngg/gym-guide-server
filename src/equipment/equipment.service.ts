import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NotFoundError } from 'rxjs';
import { Equipment } from 'src/exercises/models/equipment.model';
import { EquipmentDto } from './dto/equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(@InjectModel(Equipment) private equipmentRepository: typeof Equipment) {}

  async createEquipment(dto: EquipmentDto) {
    try {
      const isExist = await this.equipmentRepository.findOne({
        where: { name: dto.name },
      });

      if (isExist) {
        return { message: 'Запись с таким именем уже есть' };
      }

      const equipment = await this.equipmentRepository.create(dto);
      return equipment;
    } catch (error) {
      throw new ForbiddenException({ message: 'Не удалось создать' });
    }
  }

  async getAllEquipments() {
    try {
      const equipment = await this.equipmentRepository.findAll({ order: [['name', 'ASC']] });
      return equipment;
    } catch (error) {
      throw new NotFoundException({ message: 'Не удалось найти' });
    }
  }
}
