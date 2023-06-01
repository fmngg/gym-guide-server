import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];

      const user = this.jwtService.verify(token);

      if (user.role === 'ADMIN') {
        return true;
      }
      req.user = user;

      throw new ForbiddenException({ message: 'Отказано в доступе' });
    } catch (error) {
      throw new ForbiddenException({ message: 'Отказано в доступе' });
    }
  }
}
