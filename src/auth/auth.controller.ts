import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthEntity } from "./entities/auth.entity";
import {
  AuthDto,
  LoginDto,
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
  register(@Body() body: AuthDto) {
    return this.authService.register(body);
  }

  @Post("otp/generate")
  @ApiCreatedResponse()
  sendVerificationEmail(@Body() { email }: SendRegistrationEmailDto) {
    return this.authService.sendVerificationEmail(email);
  }
  @Post("/create/guestuser")
  @ApiCreatedResponse()
  createGuestUser(@Body() body: any) {
    const { isGuest } = body;
    return this.authService.createGuestUser(isGuest);
  }

  @Post("otp/verify")
  @ApiCreatedResponse()
  verifyOTP(@Body() { otp, email }: VerificationDto) {
    return this.authService.verifyOTP(otp, email);
  }
  @Post("reset/otp")
  @ApiCreatedResponse()
  sendResetEmail(@Body() { email }: SendRegistrationEmailDto) {
    return this.authService.sendresetEmail(email);
  }

  @Post("reset/password")
  @ApiCreatedResponse()
  resetPassword(@Body() { email, newPassword }: ResetPasswordDto) {
    return this.authService.resetPassword(email, newPassword);
  }
}
