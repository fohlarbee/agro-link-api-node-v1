import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { BaseResponse } from 'src/app/entities/BaseResponse.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      message: 'Login successful',
      data: { accessToken: this.jwtService.sign(payload) },
    };
  }

  async register({ email, password, name }: AuthDto): Promise<BaseResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser)
      throw new ConflictException('Email is already registered');
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
    await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    return {
      status: 'success',
      message:
        'Registration successful! Please login with your email and password.',
    };
  }
}
