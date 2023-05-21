import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.user.dto';
import { NewUserDto } from './dtos/new.user.dto';
import { TokenGoogleAuthDto } from './dtos/token.google.auth.dto';
import { ValidationEmailDto } from './dtos/validation.code.email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: LoginUserDto) {
    return await this.authService.verifyUserCredentials(credentials);
  }

  @Post('register')
  async register(@Body() newUserDto: NewUserDto) {
    return await this.authService.registerNewUser(newUserDto);
  }

  @Get('validation-email/:code')
  async validateEmail(@Param() { code }: ValidationEmailDto) {
    return await this.authService.validateEmail(code);
  }

  @Post('google-auth/:token')
  async googleAuth(@Param() { token }: TokenGoogleAuthDto) {
    return await this.authService.googleAuth(token);
  }
}
