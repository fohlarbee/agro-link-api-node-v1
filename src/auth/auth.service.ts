/* eslint-disable prettier/prettier */
import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthEntity } from "./entities/auth.entity";
import * as bcrypt from "bcrypt";
import { AuthDto } from "./dto/auth.dto";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { OtpService } from "src/otp/otp.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const payload = { email: user.email, sub: user.id };
    return {
      message: "Login successful",
      data: { accessToken: this.jwtService.sign(payload) },
      avatar: `https://ui-avatars.com/api/?name=${user.email}`,
    };
  }

  async register({ email, password, name }: AuthDto): Promise<BaseResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser)
      throw new ConflictException("Email is already registered");
    const userVerified = await this.prisma.otp.findUnique({
      where: { email, isVerified: true },
    });
    if (!userVerified)
      throw new UnauthorizedException("Please verify your email first");
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
    await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    await this.prisma.otp.delete({ where: { email } });

    return {
      status: "success",
      message:
        "Registration successful! Please login with your email and password.",
    };
  }

  async sendVerificationEmail(email: string) {
    const generatedOTP = `${Math.floor(100000 + Math.random() * 900000)}`;

    const otpExits = await this.prisma.otp.findFirst({ where: { email } });
    if (otpExits) {
      if (otpExits && Number(otpExits.expiresAt.getTime()) < Date.now()) {
        await this.prisma.otp.delete({ where: { email } });
      } else {
        throw new HttpException("OTP has been sent to your mail already", 401);
      }
    }
    await this.otpService.sendVerificationEmail({
      email,
      generatedOTP,
    });
    // if (!mail)
    //   throw new HttpException(
    //     "An error occured while sending verification email",
    //     403,
    //   );

    const hashedOTP = await bcrypt.hashSync(generatedOTP, bcrypt.genSaltSync());

    await this.prisma.otp.create({
      data: {
        email: email,
        otp: hashedOTP,
        for: "signup",
        isVerified: false,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });
    return {
      message: "Verification email sent",
      status: "success",
    };
  }
  async sendresetEmail(email: string) {
    const generatedOTP = `${Math.floor(100000 + Math.random() * 900000)}`;

    await this.otpService.sendResetPasswordEmail({ email, generatedOTP });

    const hashedOTP = await bcrypt.hashSync(generatedOTP, bcrypt.genSaltSync());

    await this.prisma.otp.create({
      data: {
        email: email,
        otp: hashedOTP,
        for: "resetPassword",
        isVerified: false,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    return {
      message: "Reset email sent",
      status: "success",
    };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpException("User not found", 404);

    const otpRecord = await this.prisma.otp.findUnique({
      where: { email, for: { equals: "resetPassword" } },
    });
    if (!otpRecord)
      throw new HttpException("PLease verify Email to proceed", 403);

    const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync());
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await this.prisma.otp.delete({ where: { email } });

    return {
      message: "Password reset successful",
      status: "success",
    };
  }

  async verifyOTP(otp: string, email: string) {
    const verified = await this.otpService.verifyOTP(otp, email);

    if (!verified)
      throw new HttpException("Error while verifying OTP: " + email, 403);

    return {
      status: "success",
      message: "OTP Verification Successful",
    };
  }
}
