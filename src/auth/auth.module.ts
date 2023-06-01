import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    FilesModule,
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'privateKey',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
