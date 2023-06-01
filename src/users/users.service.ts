import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { Op } from 'sequelize';
import { Exercise } from 'src/exercises/models/excercises.model';
import { FilesService } from 'src/files/files.service';
import { UserDto } from './dto/user.dto';
import { Favourites } from './models/favourites.model';
import { FavouritesExercise } from './models/favouritesExercise.model';
import { User } from './models/users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(FavouritesExercise)
    private favouritesExerciseRepository: typeof FavouritesExercise,
    @InjectModel(Favourites) private favouritesRepository: typeof Favourites,
    private jwtService: JwtService,
    private filesService: FilesService,
  ) {}

  async createUser(dto: UserDto) {
    try {
      const user = await this.userRepository.create(dto);
      await this.favouritesRepository.create({ userId: user.id });
      return user;
    } catch (error) {
      throw new ForbiddenException({ message: 'Не удалось создать пользователя' });
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();
      return users;
    } catch (error) {
      throw new NotFoundException({ message: 'Не найдено' });
    }
  }

  async getUserById(userId: number) {
    try {
      const user = await this.userRepository.findByPk(userId, { include: { all: true } });

      if (!user) {
        throw new Error();
      }

      return user;
    } catch (error) {
      throw new NotFoundException({ message: 'Пользователя не существует' });
    }
  }

  async getUserByValue(value: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { [Op.or]: [{ email: value }, { name: value }] },
        include: { all: true },
      });

      return user;
    } catch (error) {
      throw new NotFoundException({ message: 'Пользователя не существует' });
    }
  }

  async deleteUser(userId: number) {
    try {
      await this.userRepository.destroy({ where: { id: userId } });
    } catch (error) {
      throw new ForbiddenException({ message: 'Ошибка при удалении' });
    }
  }

  async getMe(request: Request) {
    try {
      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];

      const userData = await this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: userData.id, email: userData.email },
        include: { all: true },
      });

      if (!user) {
        return { message: 'Пользователь не найден' };
      }

      return user;
    } catch (error) {
      throw new NotFoundException({ message: 'Ошибка получения профиля' });
    }
  }

  async getMyFavourites(request: Request) {
    try {
      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];

      const userData = await this.jwtService.verify(token);
      console.log(userData);

      const user = await this.userRepository.findOne({
        where: { id: userData.id, email: userData.email },
        include: { all: true },
      });

      if (!user) {
        return { message: 'Пользователь не найден' };
      }

      const favourites = await this.favouritesExerciseRepository.findAll({
        where: {
          favouritesId: user.favourites.id,
        },
        include: { all: true },
      });

      if (!favourites) {
        return { message: 'Избранные не найдены' };
      }

      return favourites.map((obj) => obj.exercise);
    } catch (error) {
      console.log(error);

      throw new NotFoundException({ message: 'Ошибка получения избранных' });
    }
  }

  async changeRole(userId: number) {
    try {
      const user = await this.userRepository.findByPk(userId);

      if (user.role === 'USER') {
        user.role = 'ADMIN';
        user.save();
        return user;
      }

      if (user.role === 'ADMIN') {
        user.role = 'USER';
        user.save();
        return user;
      }
    } catch (error) {
      throw new ForbiddenException({ message: 'Не удалось изменить роль' });
    }
  }

  async clearStaticFolder() {
    const images = await this.userRepository.findAll({ attributes: ['img'] });
    await this.filesService.clearStaticFolder(
      images.map((obj) => obj.img),
      'users',
    );
    return { message: 'Файлы успешно удалены' };
  }
}
