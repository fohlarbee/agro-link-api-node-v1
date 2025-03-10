import {
  ConflictException,
  HttpException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthEntity } from "./entities/auth.entity";
import * as bcrypt from "bcrypt";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { OtpService } from "src/otp/otp.service";
import { AuthDto, Role } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async login(
    email: string,
    password: string,
    deviceUUID: string,
  ): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!user.deviceUUID) {
      const staff = await this.prisma.staff.findFirst({
        where: { userId: user.id },
      });
      if (!staff) throw new UnauthorizedException("Unauthorized to login");
      await this.prisma.user.update({
        where: { id: user.id },
        data: { deviceUUID: bcrypt.hashSync(deviceUUID, bcrypt.genSaltSync()) },
      });
    }
    if (!(await bcrypt.compare(deviceUUID, user.deviceUUID))) {
      throw new NotAcceptableException(
        "Invalid device, Kindly, authorize with this device",
      );
    }
    let staff;
    if (!user.role) {
      staff = await this.prisma.staff.findFirst({
        where: { userId: user.id },
      });
    }
    // else if (user.role !== Role.customer && user.role !== Role.guest) {
    //   staff = await this.prisma.staff.findFirst({
    //     where: {
    //       userId: user.id,
    //       role: {
    //         name: { equals: BusinessRoles.admin || BusinessRoles.attendant },
    //       },
    //     },
    //     select: { businessId: true, role: true },
    //   });
    // }

    const payload = { email: user.email, sub: user.id };
    return {
      message: "Login successful",
      data: { accessToken: this.jwtService.sign(payload) },
      avatar: user.avatar,
      role: user.role ?? staff?.role.name ?? Role.customer,
      business_id: staff?.businessId ?? undefined,
    };
  }

  async register(authDto: AuthDto): Promise<BaseResponse> {
    const { name, email, password, role, imageURL, deviceUUID } = authDto;
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
    const hashedDeviceUUID = bcrypt.hashSync(deviceUUID, bcrypt.genSaltSync());
    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatar: imageURL,
        role,
        deviceUUID: hashedDeviceUUID,
      },
    });
    await this.prisma.otp.delete({ where: { email, for: "signup" } });

    return {
      status: "success",
      message:
        "Registration successful! Please login with your email and password.",
    };
  }

  async createGuestUser(isGuest: boolean) {
    if (!isGuest) throw new UnauthorizedException("Access denied");

    const lastGuest = await this.prisma.user.findFirst({
      where: { role: Role.guest, name: { startsWith: "guest-" } },
      orderBy: { id: "desc" },
    });

    let guestNumber = 1;

    if (lastGuest) {
      const lastGuestNumber = parseInt(lastGuest.name.split("-")[1]);
      guestNumber = isNaN(lastGuestNumber) ? 1 : lastGuestNumber + 1;
    }
    const guestUser = `guest-${guestNumber}`;
    const guestExists = await this.prisma.user.findFirst({
      where: { name: guestUser },
    });
    if (guestExists) throw new ConflictException("Guest user already exists");

    const hashedPassword = bcrypt.hashSync(
      process.env.GUEST_USER_PASSWORD,
      bcrypt.genSaltSync(),
    );

    const newGuestUser = await this.prisma.user.create({
      data: {
        email: `${guestUser}-${process.env.GUEST_USER_EMAIL}`,
        password: hashedPassword,
        name: guestUser,
        avatar: `${process.env.GUEST_AVATAR}=${guestUser}`,
        role: Role.guest,
      },
    });
    const payload = { email: newGuestUser.email, sub: newGuestUser.id };

    return {
      message: "Login successful",
      data: { accessToken: this.jwtService.sign(payload) },
      avatar: newGuestUser.avatar,
      role: Role.guest,
    };
  }

  async sendVerificationEmail(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser)
      throw new ConflictException("Email is already registered");

    const otpExits = await this.prisma.otp.findFirst({ where: { email } });
    if (otpExits) {
      if (otpExits && Number(otpExits.expiresAt.getTime()) < Date.now()) {
        await this.prisma.otp.delete({ where: { email } });
      } else {
        throw new HttpException("OTP has been sent to your mail already", 401);
      }
    }

    const generatedOTP = `${Math.floor(100000 + Math.random() * 900000)}`;

    await this.otpService.sendVerificationEmail({
      email,
      generatedOTP,
    });

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
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser)
      throw new UnauthorizedException("Email address not validd");
    const name = existingUser.name;
    const otpExits = await this.prisma.otp.findFirst({ where: { email } });
    if (otpExits) {
      if (otpExits && Number(otpExits.expiresAt.getTime()) < Date.now()) {
        await this.prisma.otp.delete({ where: { email } });
      } else {
        throw new HttpException("OTP has been sent to your mail already", 401);
      }
    }

    const generatedOTP = `${Math.floor(100000 + Math.random() * 900000)}`;

    await this.otpService.sendResetPasswordEmail({ email, name, generatedOTP });

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
      throw new UnauthorizedException("Please verify Email to proceed");
    if (!otpRecord.isVerified)
      throw new UnauthorizedException("OTP has not been verified");

    const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync());
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await this.prisma.otp.delete({ where: { email, for: "resetPassword" } });

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

  async sendVerifyDeviceUUIDEmail(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser)
      throw new UnauthorizedException("Email address not validd");

    const otpExits = await this.prisma.otp.findFirst({ where: { email } });
    if (otpExits) {
      if (otpExits && Number(otpExits.expiresAt.getTime()) < Date.now()) {
        await this.prisma.otp.delete({ where: { email } });
      } else {
        throw new HttpException("OTP has been sent to your mail already", 401);
      }
    }

    const generatedOTP = `${Math.floor(100000 + Math.random() * 900000)}`;

    await this.otpService.sendVerifyEmailForDeviceUUID({ email, generatedOTP });

    const hashedOTP = await bcrypt.hashSync(generatedOTP, bcrypt.genSaltSync());

    await this.prisma.otp.create({
      data: {
        email: email,
        otp: hashedOTP,
        for: "verifyDevice",
        isVerified: false,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    return {
      message: "Device verification mail sent",
      status: "success",
    };
  }

  async resetDeviceUUID(email: string, deviceUUID: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpException("User not found", 404);

    const otpRecord = await this.prisma.otp.findUnique({
      where: { email, for: { equals: "verifyDevice" } },
    });
    if (!otpRecord)
      throw new UnauthorizedException("PLease verify Email to proceed");

    const hashedDeviceUUID = bcrypt.hashSync(deviceUUID, bcrypt.genSaltSync());
    await this.prisma.user.update({
      where: { email },
      data: { deviceUUID: hashedDeviceUUID },
    });

    await this.prisma.otp.delete({ where: { email, for: "verifyDevice" } });

    return {
      message: "New device registered",
      status: "success",
    };
  }
}
