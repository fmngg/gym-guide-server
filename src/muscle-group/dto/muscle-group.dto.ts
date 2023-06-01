import { IsString } from 'class-validator';

export class MuscleGrouptDto {
  @IsString({ message: 'Title must be a string value' })
  readonly name: string;
}
