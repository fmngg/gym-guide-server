import { IsString, Length, IsNotEmpty, NotEquals } from 'class-validator';

export class PostDto {
  @Length(3, 100, { message: 'Title must contain from 3 to 100 characters' })
  @IsString({ message: 'Title must be a string value' })
  @IsNotEmpty({ message: 'Title is required' })
  readonly title: string;
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string value' })
  readonly text: string;
  readonly image: string;
}
