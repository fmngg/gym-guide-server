import { IsString } from 'class-validator';

export class EquipmentDto {
  @IsString({ message: 'Title must be a string value' })
  readonly name: string;
}
