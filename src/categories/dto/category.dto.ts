import { IsString } from 'class-validator';

export class CategoryDto {
  @IsString({ message: 'Title must be a string value' })
  readonly name: string;
}
