import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
  minLength,
} from 'class-validator';

export class ExerciseDto {
  @Length(3, 100, { message: 'Title must contain from 3 to 100 characters' })
  @IsString({ message: 'Title must be a string value' })
  @IsNotEmpty({ message: 'Title is required' })
  readonly name: string;
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string value' })
  readonly description: string;
  readonly image: string;
  @IsOptional()
  @IsString({ message: 'Reccomendation must be a link' })
  readonly recommended?: string;
  readonly equipmentId: number;
  readonly difficultyId: number;
}
