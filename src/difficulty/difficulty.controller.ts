import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/users/roles.guard';
import { DifficultyService } from './difficulty.service';
import { DifficultytDto } from './dto/difficulty.dto';

@Controller('difficulty')
export class DifficultyController {
  constructor(private readonly difficultyService: DifficultyService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  createDifficulty(@Body() difficultyDto: DifficultytDto) {
    return this.difficultyService.createDifficulty(difficultyDto);
  }

  @Get()
  getAllDifficulties() {
    return this.difficultyService.getAllDifficulties();
  }
}
