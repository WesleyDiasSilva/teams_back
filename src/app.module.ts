import { Module } from '@nestjs/common';
import { AuthModule } from './domains/auth/auth.module';
import { EmailModule } from './common/email/email.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule, EmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
