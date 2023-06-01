import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryDto } from './dto/category.dto';
import { Category } from './models/categories';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryRepository: typeof Category) {}

  async createCategory(dto: CategoryDto) {
    try {
      const isExist = await this.categoryRepository.findOne({
        where: { name: dto.name },
      });

      if (isExist) {
        return { message: 'Запись с таким именем уже есть' };
      }

      const category = await this.categoryRepository.create(dto);
      return category;
    } catch (error) {
      throw new ForbiddenException({ message: 'Не удалось создать' });
    }
  }

  async getAllCategories() {
    try {
      const category = await this.categoryRepository.findAll({ order: [['id', 'ASC']] });
      return category;
    } catch (error) {
      throw new NotFoundException({ message: 'Не удалось найти' });
    }
  }
}
