import { IsString, Length } from 'class-validator';

export class ChangePasswordValidationDto {
  @IsString()
  @Length(6, 40)
  password: string;
}
