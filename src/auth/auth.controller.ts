import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
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
import { FileInterceptor } from "@nestjs/platform-express";
import { storage, 
  MAX_IMAGE_SIZE, 
  fileFilter } 
  from "src/utils/interceptors/file-upload.interceptor";


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
  @UseInterceptors(
    FileInterceptor("file", {
      storage,
      fileFilter,
      limits: { fileSize: MAX_IMAGE_SIZE },
    }),
  )
  @ApiCreatedResponse()
  register(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: AuthDto
  ) {
    return this.authService.register(body, file);
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
  @Post("reset/otp")
  @ApiCreatedResponse()
  sendResetEmail(@Body() { email }: SendRegistrationEmailDto) {
    return this.authService.sendresetEmail(email);
  }

  @Post("reset-password")
  @ApiCreatedResponse()
  resetPassword(@Body() { email, newPassword }: ResetPasswordDto) {
    return this.authService.resetPassword(email, newPassword);
  }
}
