import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: UserDto) {
    return this.authService.login(userDto);
  }

  @UseInterceptors(FileInterceptor('img'))
  @UsePipes(ValidationPipe)
  @Post('/register')
  register(@Body() userDto: UserDto, @UploadedFile() img) {
    return this.authService.register(userDto, img);
  }
}
