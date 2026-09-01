import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRotinaDto {
  @IsNotEmpty()
  @IsString()
  titleTask: string;

  @IsNotEmpty()
  @IsString()
  titleCategory: string;

  @IsString()
  descriptionTask: string;

  @IsString()
  descriptionCategory: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
