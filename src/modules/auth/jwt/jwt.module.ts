// src/auth/jwt/jwt.module.ts
import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    UsersModule, // Import UsersModule to use UsersService in JwtStrategy
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy, NestJwtModule],
})
export class JwtModule {}
