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
  descriptionsCategory: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
