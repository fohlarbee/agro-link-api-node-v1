import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "src/auth/dto/auth.dto";
import RoleGuard from "src/auth/role/role.guard";
import { GuestUserMigrationDTO } from "./dto/migration-dto";

@Controller("users")
@ApiTags("Users (Migration)")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/migrate")
  @UseGuards(RoleGuard([Role.customer]))
  migrate(@Body() migrationDto: GuestUserMigrationDTO, @Req() request) {
    const { id } = request.user;

    return this.usersService.migrateGuestUser(+id, migrationDto);
  }
}
