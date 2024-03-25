import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { Role } from '@prisma/client';
import { BaseResponse } from 'src/app/entities/BaseResponse.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string, role: Role): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email, roleId: role.id } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { email: user.email, sub: user.id, role: role.name };
    return { 
      message: "Login successful", 
      data: { accessToken: this.jwtService.sign(payload) }
    };
  }

  async register({ email, password }: AuthDto, role: Role): Promise<BaseResponse> {
    const existingUser = await this.prisma.user.findUnique({ where: { email }});
    if (existingUser) throw new ConflictException("Email is already registered");
    const salt = await bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hashSync(password, salt)
    await this.prisma.user.create({ 
      data: { email, password: hashedPassword, roleId: role.id }
    });
    return {
      status: "success",
      message: 'Registration successful! Please login with your email and password.'
    };
  }
}
