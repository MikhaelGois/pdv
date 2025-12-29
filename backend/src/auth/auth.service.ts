import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user || user.passwordHash !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = await this.jwt.signAsync(payload);
    return { access_token: token, user: payload };
  }
}
