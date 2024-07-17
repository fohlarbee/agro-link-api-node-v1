import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthEntity } from "./entities/auth.entity";
import {
  AuthDto,
  LoginDto,
  ResetPasswordDto,
  SendVRegistrationEmailDto,
  VerificationDto,
} from "./dto/auth.dto";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthEntity, status: HttpStatus.OK })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post("register")
  @ApiCreatedResponse()
  register(@Body() body: AuthDto) {
    return this.authService.register(body);
  }

  @Post("otp/generate")
  @ApiCreatedResponse()
  sendVerificationEmail(@Body() { email }: SendVRegistrationEmailDto) {
    return this.authService.sendVerificationEmail(email);
  }

  @Post("otp/verify")
  @ApiCreatedResponse()
  verifyOTP(@Body() { otp, email }: VerificationDto) {
    return this.authService.verifyOTP(otp, email);
  }
  @Post("reset/otp")
  @ApiCreatedResponse()
  sendResetEmail(@Body() { email }: SendVRegistrationEmailDto) {
    return this.authService.sendresetEmail(email);
  }

  @Post("reset-password")
  @ApiCreatedResponse()
  resetPassword(@Body() { email, newPassword }: ResetPasswordDto) {
    return this.authService.resetPassword(email, newPassword);
  }
}
