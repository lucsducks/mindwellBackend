import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategys/jwt.strategy';
import { VerificationCode } from './entities/verification_code.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [TypeOrmModule.forFeature([User,VerificationCode]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.registerAsync({
    imports: [],
    useFactory: async () => {
      return {
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '48h'
        }
      }
    }
  })
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '48h'
    //   }
    // })
  ],
  exports: [TypeOrmModule,JwtStrategy,PassportModule,JwtModule]
})
export class AuthModule { }
