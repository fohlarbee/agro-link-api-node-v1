import { BadRequestException, Body, Controller, Headers, Post, Request, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { AuthDto } from './dto/auth.dto';
import { HeadersInterceptor } from './interceptors/headers.interceptor';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(HeadersInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: AuthDto, @Request() { userRole }: Record<string, any>) {
    return this.authService.login(email, password, userRole);
  }

  @Post('register')
  @ApiCreatedResponse()
  register(@Body() body: AuthDto, @Request() { userRole }: Record<string, any>) {
    if (userRole.name == 'admin') throw new UnauthorizedException("You can't register for an admin account");
    return this.authService.register(body, userRole);
  }
}
