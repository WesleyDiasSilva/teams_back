import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordValidationDto } from './dtos/change.password.validation.dto';
import { LoginUserDto } from './dtos/login.user.dto';
import { NewUserDto } from './dtos/new.user.dto';
import { RememberPasswordEmailValidationDto } from './dtos/remember.password.email.validation.dto';
import { TokenGoogleAuthDto } from './dtos/token.google.auth.dto';
import { ValidationChangeEmailCodeDto } from './dtos/validation.change.email.code.dto';
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

  @Post('forgot-password/:email')
  async rememberPassword(
    @Param() { email }: RememberPasswordEmailValidationDto,
  ) {
    return await this.authService.forgotPassword(email);
  }

  @Post('forgot-password/:email/:code')
  async changePassword(
    @Body() { password }: ChangePasswordValidationDto,
    @Param() { email, code }: ValidationChangeEmailCodeDto,
  ) {
    return await this.authService.changePassword(password, email, code);
  }
}
