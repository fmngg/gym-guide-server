import { Body, Controller, Post, Get, Delete, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './models/users.model';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from './roles.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() userDto: UserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@Req() request: Request) {
    return this.usersService.getMe(request);
  }

  @UseGuards(AuthGuard)
  @Get('/me/favourites')
  getMyFavourites(@Req() request: Request) {
    return this.usersService.getMyFavourites(request);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Get('clear')
  clearStaticFolder() {
    return this.usersService.clearStaticFolder();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    this.usersService.deleteUser(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  changeRole(@Param('id') id: number) {
    this.usersService.changeRole(id);
  }
}
