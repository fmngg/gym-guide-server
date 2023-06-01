import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/users/roles.guard';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  createCategory(@Body() categoryDto: CategoryDto) {
    return this.categoriesService.createCategory(categoryDto);
  }

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }
}
