import { IsNotEmpty, IsString } from 'class-validator';

export class ValidationEmailDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
