import { IsNotEmpty, IsString } from 'class-validator';

export class RememberPasswordEmailValidationDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
