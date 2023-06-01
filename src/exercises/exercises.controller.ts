import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/users/roles.guard';
import { ExerciseDto } from './dto/exercise.dto';
import { ExercisesService } from './exercises.service';
import { Response } from 'express';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createExercise(@Body() exerciseDto: ExerciseDto, @UploadedFile() image) {
    return this.exercisesService.createExercise(exerciseDto, image);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateExercise(@Param('id') id: number, @Body() exerciseDto: ExerciseDto, @UploadedFile() image) {
    return this.exercisesService.updateExercise(exerciseDto, image, id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  deleteExercise(@Req() request: Request, @Param('id') id: number) {
    return this.exercisesService.deleteExercise(request, id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/favourite')
  addToFavourites(@Req() request: Request, @Param('id') id: number) {
    return this.exercisesService.addToFavourites(request, id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/favourite')
  deleteFromFavourites(@Req() request: Request, @Param('id') id: number) {
    return this.exercisesService.deleteFromFavourites(request, id);
  }

  @Get('search')
  getSearchResult(@Query() query: object) {
    return this.exercisesService.getSearchResult(
      query['name'],
      query['difficulty'],
      query['equipment'],
    );
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Get('clear')
  clearStaticFolder() {
    return this.exercisesService.clearStaticFolder();
  }

  @Get('filters')
  getFilters() {
    return this.exercisesService.getFilters();
  }

  @Get(':id')
  getOneExercise(@Param('id') id: number) {
    return this.exercisesService.getOneExercise(id);
  }

  @Get()
  getAllExercises(@Query() query: object, @Res() res: Response) {
    return this.exercisesService.getAllExercises(
      res,
      query['sort'],
      query['page'],
      query['pageLimit'],
      query['name'],
      query['difficulty'],
      query['equipment'],
      query['muscleGroup'],
    );
  }

  @Post(':id/rate')
  rate(@Req() request: Request, @Param('id') id: number, @Body() dto: object) {
    return this.exercisesService.rate(request, id, dto);
  }

  @Delete(':id/rate')
  deleteRate(@Req() request: Request, @Param('id') id: number, @Body() dto: object) {
    return this.exercisesService.rate(request, id, dto);
  }
}
