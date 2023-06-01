import { PostsService } from './posts.service';
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
import { PostDto } from './dto/post.dto';
import { Response } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPost(@Body() postDto: PostDto, @UploadedFile() image) {
    return this.postsService.createPost(postDto, image);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updatePost(@Param('id') id: number, @Body() postDto: PostDto, @UploadedFile() image) {
    return this.postsService.updatePost(postDto, image, id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postsService.deletePost(id);
  }

  @Get('search')
  getSearchResult(@Query() query: object) {
    return this.postsService.getSearchResult(query['title'], query['category']);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Get('clear')
  clearStaticFolder() {
    return this.postsService.clearStaticFolder();
  }

  @Get('recommended')
  getRecommendedPosts(@Query() query: object) {
    return this.postsService.getRecommendedPosts(query['categoryId']);
  }

  @Delete('comment/:id')
  deleteComment(@Req() request: Request, @Param('id') id: number) {
    return this.postsService.deleteComment(request, id);
  }

  @Get(':id')
  getOnePost(@Param('id') id: number) {
    return this.postsService.getOnePost(id);
  }

  @Get()
  getAllPosts(@Query() query: object, @Res() res: Response) {
    return this.postsService.getAllPosts(
      res,
      query['sort'],
      query['page'],
      query['pageLimit'],
      query['title'],
      query['category'],
    );
  }

  @Post(':id')
  createComment(@Req() request: Request, @Param('id') id: number, @Body() dto: object) {
    return this.postsService.createComment(request, id, dto);
  }
}
