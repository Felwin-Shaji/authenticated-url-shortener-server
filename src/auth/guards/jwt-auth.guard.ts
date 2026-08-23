import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest, JwtPayload } from '../interfaces/authenticated-request.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('Authentication required');
    }

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    try {
      // 1. Get secret from ConfigService
      const secret = this.configService.get<string>('JWT_ACCESS_SECRET');

      // 2. Pass secret into verify()
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret,
      });

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}