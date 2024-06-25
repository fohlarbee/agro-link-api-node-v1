import { BadRequestException, Body, Controller, Headers, HttpCode, HttpStatus, Post, Request, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeaders, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { HeadersInterceptor } from './interceptors/headers.interceptor';

@Controller('auth')
@ApiTags('Authentication')
// @UseInterceptors(HeadersInterceptor)
// @ApiHeaders([{ name: "cm-user-role", required: true, description: "This is role of the user to be signed"}])
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthEntity, status: HttpStatus.OK })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  @ApiCreatedResponse()
  register(@Body() body: AuthDto) {
    return this.authService.register(body);
  }
}
