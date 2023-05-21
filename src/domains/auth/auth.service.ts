import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import admin from 'src/common/config/firebase.admin.config';
import { EmailService } from 'src/common/email/email.service';
import { generateToken } from 'src/common/helpers/jwt.helpers';
import {
  hashPassword,
  verifyPassword,
} from 'src/common/helpers/password.helpers';
import { generateUniqueCode } from 'src/common/helpers/uuid.helpers';
import { AuthRepository } from './auth.repository';
import { LoginUserDto } from './dtos/login.user.dto';
import { NewUserDto } from './dtos/new.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  async googleAuth(token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userUid = decodedToken.uid;
      const user = await this.authRepository.findUserByUid(userUid);
      if (!user) {
        const newUser = {
          email: decodedToken.email,
          name: decodedToken.name.split(' ')[0],
          last_name: decodedToken.name.split(' ')[1],
          image: decodedToken.picture,
          uid: userUid,
          password: userUid,
        };
        await this.registerNewUser(newUser);
      }
      return this.verifyUserCredentials({
        email: decodedToken.email,
        password: userUid,
      });
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }

  async registerNewUser(newUserDto: NewUserDto) {
    const emailExists = await this.authRepository.findUserByEmail(
      newUserDto.email,
    );
    if (emailExists) {
      throw new ConflictException();
    }
    const allowedDomains = await this.authRepository.getAllowedDomains();
    const emailDomain = newUserDto.email.split('@')[1];
    const isDomainAllowed = allowedDomains.some(
      (domain) => domain.name === emailDomain,
    );
    if (!isDomainAllowed) {
      throw new UnauthorizedException('Dominio não permitido');
    }
    const hashedPassword = await hashPassword(newUserDto.password);
    newUserDto.password = hashedPassword;
    const newUserCreated = await this.authRepository.createUser(newUserDto);
    const uniqueCode = generateUniqueCode();
    await this.authRepository.saveCode(newUserCreated.id, uniqueCode);
    await this.emailService.sendConfirmationEmail(newUserDto.email, uniqueCode);
    return newUserCreated;
  }

  async verifyUserCredentials({ email, password }: LoginUserDto) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const token = await generateToken(user);
    const session = await this.authRepository.newSession(
      user.id,
      token.access_token,
    );
    await this.authRepository.updateSessionIdByUser(user.id, session.id);
    return token;
  }

  async validateEmail(code: string) {
    if (!code) throw new NotFoundException();
    const emailCode = await this.authRepository.findUserByCodeEmail(code);
    if (!emailCode) {
      throw new NotFoundException();
    }
    await this.authRepository.validateEmail(emailCode.user_id);
    await this.authRepository.deleteCode(code);
    return { message: 'E-mail verificado com sucesso!' };
  }
}
