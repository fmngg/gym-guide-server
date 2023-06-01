import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 'Ilya' })
  @IsString({ message: 'Name must be a string value' })
  readonly name: string;
  @ApiProperty({ example: 'ilyafomin@mail.ru' })
  @IsEmail({}, { message: 'Email must be valid' })
  readonly email: string;
  @ApiProperty({ example: '12345678' })
  @Length(4, 16, { message: 'Password must contain from 4 to 16 characters' })
  readonly password: string;
  @ApiProperty({ example: 'avatar.jpg' })
  @IsOptional()
  readonly img?: string;
  readonly favourites: object[];
}
