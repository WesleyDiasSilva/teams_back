import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import admin from 'src/common/config/firebase.admin.config';
import { EmailService } from 'src/common/email/email.service';
import { generateCode } from 'src/common/helpers/generate.code.helpers';
import {
  decodeToken,
  generateRememberPasswordToken,
  generateToken,
  verifyToken,
} from 'src/common/helpers/jwt.helpers';
import {
  hashPassword,
  verifyPassword,
} from 'src/common/helpers/password.helpers';
import { generateUniqueCode } from 'src/common/helpers/uuid.helpers';
import { DecodedCodeRememberPassword } from 'src/types/jwt';
import { AuthRepository } from './auth.repository';
import { LoginUserDto } from './dtos/login.user.dto';
import { NewUserDto } from './dtos/new.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  private async manageToken(user: User) {
    const token = await generateToken(user);
    const session = await this.authRepository.newSession(
      user.id,
      token.access_token,
    );
    await this.authRepository.updateSessionIdByUser(user.id, session.id);
    return token;
  }

  async changePassword(newPassword: string, email: string, code: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    const emailCode = await this.authRepository.getCodeRememberPassword(
      user.id,
    );
    if (emailCode.length === 0) {
      throw new NotFoundException();
    }
    const isCodeValid = verifyToken(emailCode[0].token);
    if (!isCodeValid) {
      throw new UnauthorizedException('Código expirado!');
    }
    const codeDecoded = decodeToken(
      emailCode[0].token,
    ) as DecodedCodeRememberPassword;
    if (codeDecoded.code !== code) {
      console.log('Código diferente!');
      throw new UnauthorizedException();
    }
    const hashedPassword = await hashPassword(newPassword);
    await this.authRepository.updatePassword(user.id, hashedPassword);
    return { message: 'Senha alterada com sucesso!' };
  }

  async googleAuth(token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await this.authRepository.findUserByEmail(
        decodedToken.email,
      );
      let userCreated: User;
      if (!user) {
        const newUser = {
          email: decodedToken.email,
          name: decodedToken.name.split(' ')[0],
          last_name: decodedToken.name.split(' ')[1],
          image: decodedToken.picture,
          uid: decodedToken.uid,
          password: decodedToken.uid,
        };
        userCreated = await this.registerNewUser(newUser);
      }
      return this.manageToken(userCreated);
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
    if (newUserDto) {
    }
    const hashedPassword = await hashPassword(newUserDto.password);
    newUserDto.password = hashedPassword;
    const newUserCreated = await this.authRepository.createUser(newUserDto);
    delete newUserCreated.password;
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
    if (user.is_email_verified === false) {
      throw new UnauthorizedException('E-mail não validado');
    }
    return this.manageToken(user);
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

  async forgotPassword(email: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    const code = generateCode(6);
    const token = await generateRememberPasswordToken(code);
    await this.authRepository.saveCodeRememberPassword(user.id, token.code);
    await this.emailService.sendRememberPasswordEmail(email, code);
    return { message: 'E-mail enviado com sucesso!' };
  }
}
