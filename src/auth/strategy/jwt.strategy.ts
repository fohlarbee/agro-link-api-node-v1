import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ sub: userId, role: roleName }: { sub: number; role: string }) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName }
    });

    if (!role) throw new NotFoundException(`Invalid role ${roleName}!`);

    const user = await this.prisma.user.findFirst({
      where: { id: userId, role }
    });
    if (!user) throw new UnauthorizedException();
    return { ...user, role: role.name };
  }
}
