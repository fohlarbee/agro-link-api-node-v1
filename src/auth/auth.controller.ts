import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthEntity } from "./entities/auth.entity";
import {
  AuthDto,
  LoginDto,
  ResetDeviceUUIDDto,
  ResetPasswordDto,
  SendRegistrationEmailDto,
  VerificationDto,
} from "./dto/auth.dto";
import {
  parseFileInterceptor,
  FileUploadInterceptor,
} from "src/utils/interceptors/file-upload.interceptor";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthEntity, status: HttpStatus.OK })
  login(@Body() { email, password, deviceUUID }: LoginDto) {
    return this.authService.login(email, password, deviceUUID);
  }

  @Post("register")
  @UseInterceptors(parseFileInterceptor, FileUploadInterceptor)
  @ApiCreatedResponse()
  register(@Req() req, @Body() body: AuthDto) {
    const { imageURL } = req.body;
    if (!imageURL) {
      return new BadRequestException("No file uploaded");
    }
    return this.authService.register({ imageURL, ...body });
  }

  @Post("guest")
  @ApiCreatedResponse()
  createGuestUser(@Body() body: any) {
    const { isGuest } = body;
    return this.authService.createGuestUser(isGuest);
  }

  @Post("otp/generate")
  @ApiCreatedResponse()
  sendVerificationEmail(@Body() { email }: SendRegistrationEmailDto) {
    return this.authService.sendVerificationEmail(email);
  }

  @Post("otp/verify")
  @ApiCreatedResponse()
  verifyOTP(@Body() { otp, email }: VerificationDto) {
    return this.authService.verifyOTP(otp, email);
  }
  @Post("otp/reset")
  @ApiCreatedResponse()
  sendResetEmail(@Body() { email }: SendRegistrationEmailDto) {
    return this.authService.sendresetEmail(email);
  }

  @Post("reset/password")
  @ApiCreatedResponse()
  resetPassword(@Body() { email, newPassword }: ResetPasswordDto) {
    return this.authService.resetPassword(email, newPassword);
  }

  @Post("otp/verifydevice")
  @ApiCreatedResponse()
  sendVerifyDeviceUUIDEmail(@Body() { email }: SendRegistrationEmailDto) {
    return this.authService.sendVerifyDeviceUUIDEmail(email);
  }

  @Post("reset/deviceUUID")
  @ApiCreatedResponse()
  resetDeviceUUID(@Body() { email, deviceUUID }: ResetDeviceUUIDDto) {
    return this.authService.resetDeviceUUID(email, deviceUUID);
  }
}
