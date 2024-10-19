import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponseProperty,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "src/auth/dto/auth.dto";
import RoleGuard from "src/auth/role/role.guard";
import { GuestUserMigrationDTO } from "./dto/migration-dto";
import { UserProfileResponseDto } from "./dto/user-dto";

@Controller("users")
@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  @ApiOperation({ description: "Get a user profile " })
  @ApiResponseProperty({ type: UserProfileResponseDto })
  async profile(@Req() request: any) {
    const { id } = request.user;
    return this.usersService.profile(+id);
  }

  @Post("migrate")
  @ApiOperation({
    description: "Migrate a guest order history to a valid customer",
  })
  @UseGuards(RoleGuard([Role.customer]))
  migrate(@Body() migrationDto: GuestUserMigrationDTO, @Req() request) {
    const { id } = request.user;

    return this.usersService.migrateGuestUser(+id, migrationDto);
  }
}
