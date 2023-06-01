import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/users/roles.guard';
import { EquipmentDto } from './dto/equipment.dto';
import { EquipmentService } from './equipment.service';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  createEquipment(@Body() equipmentDto: EquipmentDto) {
    return this.equipmentService.createEquipment(equipmentDto);
  }

  @Get()
  getAllEquipments() {
    return this.equipmentService.getAllEquipments();
  }
}
