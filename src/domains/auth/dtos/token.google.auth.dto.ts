import { IsNotEmpty, IsString } from 'class-validator';

export class TokenGoogleAuthDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
