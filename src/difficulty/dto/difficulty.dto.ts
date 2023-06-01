import { IsString } from 'class-validator';

export class DifficultytDto {
  @IsString({ message: 'Title must be a string value' })
  readonly name: string;
}
