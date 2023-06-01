import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { DifficultyModule } from 'src/difficulty/difficulty.module';
import { FilesService } from 'src/files/files.service';
import { Favourites } from 'src/users/models/favourites.model';
import { FavouritesExercise } from 'src/users/models/favouritesExercise.model';
import { User } from 'src/users/models/users.model';
import { ExerciseDto } from './dto/exercise.dto';
import { Difficulty } from './models/difficulty.model';
import { Exercise } from './models/excercises.model';
import { Rating } from './models/rating.model';
import { Equipment } from './models/equipment.model';
import { Op, Sequelize, where } from 'sequelize';
import { MuscleGroup } from './models/muscle-group.model';
import { MuscleGroupService } from 'src/muscle-group/muscle-group.service';
import { EquipmentService } from 'src/equipment/equipment.service';
import { DifficultyService } from 'src/difficulty/difficulty.service';
import { Response as Res } from 'express';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(Exercise) private exerciseRepository: typeof Exercise,
    private jwtService: JwtService,
    @InjectModel(FavouritesExercise) private favouriteExerciseRepository: typeof FavouritesExercise,
    @InjectModel(Favourites) private favouritesRepository: typeof Favourites,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Rating) private ratingRepository: typeof Rating,
    private filesService: FilesService,
    private muscleGroupService: MuscleGroupService,
    private equipmentService: EquipmentService,
    private difficultyService: DifficultyService,
  ) {}

  async createExercise(dto: ExerciseDto, image: any) {
    try {
      const isExist = await this.exerciseRepository.findOne({ where: { name: dto.name } });

      if (isExist) {
        throw { message: 'Такое название уже используется' };
      }
      const fileName = await this.filesService.createFile(image, 'exercises');
      const exercise = await this.exerciseRepository.create({ ...dto, image: fileName });
      return exercise;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async updateExercise(dto: ExerciseDto, image: any, id: number) {
    try {
      let fileName = null;
      const updateObj = { ...dto };
      if (image) {
        fileName = await this.filesService.createFile(image, 'posts');
        updateObj['image'] = fileName;
      }

      const isExist = await this.exerciseRepository.findOne({ where: { name: dto.name } });

      if (isExist && isExist.id != id) {
        throw { message: 'Title is already exist' };
      }

      const exercise = await this.exerciseRepository.update(updateObj, { where: { id: id } });
      return exercise;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async getOneExercise(exerciseId: number) {
    try {
      const exercise = await this.exerciseRepository.findByPk(exerciseId, {
        include: [Difficulty, Equipment, MuscleGroup, Rating],
      });

      if (Array.isArray(exercise.rating)) {
        const getAverageRating = (rating: number[]) =>
          rating.reduce((acc, number) => acc + number, 0) / rating.length;
        exercise.avgRating = getAverageRating(exercise.rating.map((obj) => obj.rate));
      }

      exercise.views += 1;
      await exercise.save();
      return exercise;
    } catch (error) {
      console.log(error);

      throw new NotFoundException({ message: 'Не найдено' });
    }
  }

  async getAllExercises(
    res: Res,
    sort?: string,
    page?: string,
    pageLimit?: string,
    name?: string,
    difficulty?: number,
    equipment?: number,
    muscleGroup?: number,
  ) {
    try {
      const orderParams = { orderBy: 'createdAt', orderType: 'DESC' };
      const whereOptions = {};

      if (sort === 'Rating') {
        orderParams.orderBy = 'avgRating';
        orderParams.orderType = 'DESC';
      } else if (sort === 'Popular') {
        orderParams.orderBy = 'views';
        orderParams.orderType = 'DESC';
      }

      if (name) {
        whereOptions['name'] = { [Op.iLike]: `%${name}%` };
      }

      if (difficulty) {
        whereOptions['difficultyId'] = difficulty;
      }

      if (equipment) {
        whereOptions['equipmentId'] = equipment;
      }

      if (muscleGroup) {
        whereOptions['muscleGroupId'] = muscleGroup;
      }

      const exercises = await this.exerciseRepository.findAll({ include: { all: true } });

      const getAverageRating = (rating: number[]) =>
        rating.reduce((acc, number) => acc + number, 0) / rating.length;

      exercises.map((obj) => {
        if (Array.isArray(obj.rating)) {
          obj.avgRating = getAverageRating(obj.rating.map((obj) => obj.rate));
        }

        if (isNaN(obj.avgRating)) {
          obj.avgRating = 0;
        }

        obj.save();
      });

      const orderedExercises = await this.exerciseRepository.findAll({
        include: [Difficulty, Equipment, MuscleGroup],
        order: [[orderParams.orderBy, orderParams.orderType]],
        limit: Number(pageLimit) | 9,
        offset: Number(page) * 9 - 9,
        where: whereOptions,
      });

      return res.set({ 'x-total-count': exercises.length }).json(orderedExercises);
    } catch (error) {
      throw new NotFoundException({ message: 'Не найдено' });
    }
  }

  async addToFavourites(request: Request, id: number) {
    try {
      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];

      const user = await this.jwtService.verify(token);
      const favourites = await this.favouritesRepository.findOne({ where: { userId: user.id } });

      const isExerciseExists = await this.favouriteExerciseRepository.findOne({
        where: { exerciseId: id, favouritesId: favourites.id },
      });

      if (isExerciseExists) {
        return { message: 'Уже есть в избранных' };
      }

      const favouritesExercise = await this.favouriteExerciseRepository.create({
        favouritesId: favourites.id,
        exerciseId: id,
      });

      return favouritesExercise;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Ошибка сервера. Не удалось добавить в избранные',
      });
    }
  }

  async deleteFromFavourites(request: Request, id: number) {
    try {
      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];

      const user = await this.jwtService.verify(token);
      const favourites = await this.favouritesRepository.findOne({ where: { userId: user.id } });

      const isExerciseExists = await this.favouriteExerciseRepository.findOne({
        where: { exerciseId: id, favouritesId: favourites.id },
      });

      if (!isExerciseExists) {
        return { message: 'Упражнение не было найдено' };
      }

      await this.favouriteExerciseRepository.destroy({
        where: { exerciseId: id, favouritesId: favourites.id },
      });

      const deleteCheck = await this.favouriteExerciseRepository.findOne({
        where: { exerciseId: id, favouritesId: favourites.id },
      });

      if (!deleteCheck) {
        return { message: 'Успешно удалено' };
      }

      return { message: 'Не удалось удалить' };
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Ошибка сервера. Не удалось удалить из избранных',
      });
    }
  }
  async deleteExercise(request: Request, id: number) {
    try {
      await this.exerciseRepository.destroy({ where: { id: id }, cascade: true });
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException({
        message: 'Ошибка сервера. Не удалось удалить из избранных',
      });
    }
  }

  async rate(request: Request, id: number, dto: object) {
    try {
      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];

      const user = await this.jwtService.verify(token);

      const isExist = await this.ratingRepository.findOne({
        where: { userId: user.id, exerciseId: id },
      });

      if (isExist) {
        await this.ratingRepository.destroy({
          where: { userId: user.id, exerciseId: id },
        });
      }

      const rate = await this.ratingRepository.create({
        userId: user.id,
        exerciseId: id,
        rate: dto['rating'],
      });

      return rate;
    } catch (error) {
      console.log(error);

      throw new ForbiddenException({ message: 'Не удалось поставить оценку' });
    }
  }

  async getSearchResult(name?: string, difficulty?: number, equipment?: number) {
    try {
      const whereOptions = {};

      if (name) {
        whereOptions['name'] = { [Op.like]: `%${name}%` };
      }

      if (difficulty) {
        whereOptions['difficultyId'] = difficulty;
      }

      if (equipment) {
        whereOptions['equipmentId'] = equipment;
      }

      const exercise = await this.exerciseRepository.findAll({
        order: [['id', 'ASC']],
        include: [Difficulty, Equipment, Rating],
        where: whereOptions,
      });

      if (exercise.length === 0) {
        return { message: 'По результатам поиска ничего не найдено' };
      }

      return exercise;
    } catch (error) {
      console.log(error);

      throw new NotFoundException({ message: 'Не найдено' });
    }
  }

  async clearStaticFolder() {
    const images = await this.exerciseRepository.findAll({ attributes: ['image'] });
    await this.filesService.clearStaticFolder(
      images.map((obj) => obj.image),
      'exercises',
    );
    return { message: 'Файлы успешно удалены' };
  }

  async getFilters() {
    try {
      const difficulties = await this.difficultyService.getAllDifficulties();
      const muscleGroups = await this.muscleGroupService.getAllMuscleGroups();
      const equipments = await this.equipmentService.getAllEquipments();
      const filters = [
        {
          id: 1,
          title: 'Difficulty',
          items: difficulties,
        },
        {
          id: 2,
          title: 'Equipment',
          items: equipments,
        },
        {
          id: 3,
          title: 'Muscle group',
          items: muscleGroups,
        },
      ];

      return filters;
    } catch (error) {
      console.log(error);

      throw new NotFoundException({ message: 'Не найдено' });
    }
  }
}
