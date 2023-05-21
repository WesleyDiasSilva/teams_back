import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NewUserDto } from './dtos/new.user.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async createUser(newUser: NewUserDto) {
    return await this.prismaClient.user.create({
      data: newUser,
    });
  }

  async findUserByEmail(email: string) {
    return await this.prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }

  async newSession(user_id: number, token: string) {
    return await this.prismaClient.session.upsert({
      where: {
        user_id,
      },
      update: {
        token,
      },
      create: {
        user_id,
        token,
      },
    });
  }

  async getAllowedDomains() {
    return await this.prismaClient.domain.findMany();
  }

  async saveCode(user_id: number, code: string) {
    return await this.prismaClient.emailCode.upsert({
      where: {
        user_id,
      },
      update: {
        code,
      },
      create: {
        code,
        user_id,
      },
    });
  }

  async findUserByCodeEmail(code: string) {
    return await this.prismaClient.emailCode.findUnique({
      where: {
        code,
      },
    });
  }

  async validateEmail(user_id: number) {
    return await this.prismaClient.user.update({
      where: {
        id: user_id,
      },
      data: {
        is_email_verified: true,
      },
    });
  }

  async deleteCode(code: string) {
    return await this.prismaClient.emailCode.delete({
      where: {
        code,
      },
    });
  }

  async updateSessionIdByUser(user_id: number, session_id: number) {
    return await this.prismaClient.user.update({
      where: {
        id: user_id,
      },
      data: {
        session_id,
      },
    });
  }

  async findUserByUid(uid: string) {
    return await this.prismaClient.user.findUnique({
      where: {
        uid,
      },
    });
  }
}
