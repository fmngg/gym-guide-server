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
import { Op, Sequelize, where } from 'sequelize';
import { Post } from './models/posts.model';
import { Comment } from './models/comments.model';
import { PostDto } from './dto/post.dto';
import { UsersService } from 'src/users/users.service';
import { Response as Res } from 'express';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private jwtService: JwtService,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Comment) private commentRepository: typeof Comment,
    private filesService: FilesService,
    private userService: UsersService,
  ) {}

  async createPost(dto: PostDto, image: any) {
    try {
      const isExist = await this.postRepository.findOne({ where: { title: dto.title } });

      if (isExist) {
        throw { message: 'Title is already exist' };
      }

      const fileName = await this.filesService.createFile(image, 'posts');
      const post = await this.postRepository.create({ ...dto, image: fileName });
      return post;
    } catch (error) {
      console.log(error);

      throw new ForbiddenException(error);
    }
  }

  async updatePost(dto: PostDto, image: any, id: number) {
    try {
      let fileName = null;
      const updateObj = { ...dto };
      if (image) {
        fileName = await this.filesService.createFile(image, 'posts');
        updateObj['image'] = fileName;
      }

      const isExist = await this.postRepository.findOne({ where: { title: dto.title } });

      if (isExist && isExist.id != id) {
        throw { message: 'Title is already exist' };
      }

      const post = await this.postRepository.update(updateObj, { where: { id: id } });

      return post;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async getOnePost(postId: number) {
    try {
      const exercise = await this.postRepository.findByPk(postId, {
        include: { all: true },
      });

      exercise.views += 1;
      await exercise.save();
      return exercise;
    } catch (error) {
      throw new NotFoundException({ message: 'Не найдено' });
    }
  }

  async getAllPosts(
    res: Res,
    sort?: string,
    page?: string,
    pageLimit?: string,
    title?: string,
    category?: string,
  ) {
    try {
      const whereOptions = {};
      const orderOptions = { orderBy: 'createdAt', orderType: 'DESC' };

      if (sort === 'Popular') {
        orderOptions.orderBy = 'views';
        orderOptions.orderType = 'DESC';
      }

      if (title) {
        whereOptions['title'] = { [Op.iLike]: `%${title}%` };
      }

      if (category) {
        whereOptions['categoryId'] = category;
      }

      const allPosts = await this.postRepository.findAll();

      const posts = await this.postRepository.findAll({
        include: { all: true },
        order: [[orderOptions.orderBy, orderOptions.orderType]],
        limit: Number(pageLimit) | 9,
        offset: Number(page) * 9 - 9,
        where: whereOptions,
      });

      if (posts.length === 0) {
        return res.json({ message: 'По результатам поиска ничего не найдено' });
      }

      return res.set({ 'x-total-count': allPosts.length }).json(posts);
    } catch (error) {
      throw new NotFoundException({ message: 'Не найдено' });
    }
  }

  async getRecommendedPosts(categoryId?: string) {
    try {
      const sequelize = new Sequelize({ dialect: 'postgres' });

      const recommendedPosts = await this.postRepository.findAll({
        where: { categoryId: categoryId },
        order: sequelize.random(),
        limit: 4,
      });

      return recommendedPosts;
    } catch (error) {
      console.log(error);

      throw new NotFoundException({ message: 'Не найдено' });
    }
  }

  async createComment(request: Request, id: number, dto: object) {
    try {
      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];

      const user = await this.jwtService.verify(token);

      const userData = await this.userService.getUserById(user.id);

      const comment = await this.commentRepository.create({
        userId: userData.id,
        userName: userData.name,
        userImage: userData.img,
        postId: id,
        text: dto['text'],
      });

      return comment;
    } catch (error) {
      console.log(error);

      throw new ForbiddenException({ message: 'Не удалось оставить комментарий' });
    }
  }

  async deletePost(id: number) {
    try {
      await this.postRepository.destroy({ where: { id: id }, cascade: true });
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Ошибка сервера. Не удалось удалить запись',
      });
    }
  }

  async deleteComment(request: Request, id: number) {
    try {
      console.log(id);

      const comment = await this.commentRepository.destroy({
        where: {
          id: id,
        },
      });
      return comment;
    } catch (error) {
      console.log(error);
    }
  }

  async getSearchResult(title?: string, category?: number) {
    try {
      const whereOptions = {};

      if (title) {
        whereOptions['title'] = { [Op.iLike]: `%${title}%` };
      }

      if (category) {
        whereOptions['categoryId'] = category;
      }

      const posts = await this.postRepository.findAll({
        order: [['createdAt', 'DESC']],
        include: { all: true },
        where: whereOptions,
      });

      if (posts.length === 0) {
        return { message: 'По результатам поиска ничего не найдено' };
      }

      return posts;
    } catch (error) {
      console.log(error);

      throw new NotFoundException({ message: 'Не найдено' });
    }
  }

  async clearStaticFolder() {
    const images = await this.postRepository.findAll({ attributes: ['image'] });
    await this.filesService.clearStaticFolder(
      images.map((obj) => obj.image),
      'posts',
    );
    return { message: 'Файлы успешно удалены' };
  }
}
