import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/users/roles.guard';
import { MuscleGrouptDto } from './dto/muscle-group.dto';
import { MuscleGroupService } from './muscle-group.service';

@Controller('muscle-group')
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  createEquipment(@Body() muscleGroupDto: MuscleGrouptDto) {
    return this.muscleGroupService.createMuscleGroup(muscleGroupDto);
  }

  @Get()
  getAllEquipments() {
    return this.muscleGroupService.getAllMuscleGroups();
  }
}
