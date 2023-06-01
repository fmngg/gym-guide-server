import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/models/users.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private filesService: FilesService,
  ) {}

  async login(userDto: UserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async register(userDto: UserDto, img?) {
    let fileName = null;
    const checkEmail = await this.userService.getUserByValue(userDto.email);
    if (checkEmail) {
      throw new HttpException('Email is already exist', HttpStatus.BAD_REQUEST);
    }
    const checkName = await this.userService.getUserByValue(userDto.name);
    if (checkName) {
      throw new HttpException('Name is already taken', HttpStatus.BAD_REQUEST);
    }
    if (img) {
      fileName = await this.filesService.createFile(img, 'users');
    }
    const passwordHash = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: passwordHash,
      img: fileName,
    });
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: UserDto) {
    const user = await this.userService.getUserByValue(userDto.email);

    if (user) {
      const passwordCheck = await bcrypt.compare(userDto.password, user.password);
      if (passwordCheck) {
        return user;
      }
      throw new UnauthorizedException({ message: 'Invalid login or password' });
    } else {
      throw new UnauthorizedException({ message: 'Invalid login or password' });
    }
  }
}
