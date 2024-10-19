import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleCreationResponse, RoleListResponse } from "./entities/role.entity";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { BusinessAccessInterceptor } from "src/utils/interceptors/business-access-interceptor";
import RoleGuard from "src/auth/role/role.guard";
import { Role } from "src/auth/dto/auth.dto";
@Controller("admin/roles")
@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@ApiHeader({
  name: "business_id",
  required: true,
  description: "This is the business's id",
})
@UseInterceptors(BusinessAccessInterceptor)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(RoleGuard([Role.admin]))
  @ApiOkResponse({ type: RoleCreationResponse })
  create(
    @Body() createRoleDto: CreateRoleDto,
    @Req() request: Record<string, any>,
  ) {
    const { business_id } = request.headers;
    return this.rolesService.createRole(+business_id, createRoleDto);
  }

  @Get()
  @UseGuards(RoleGuard([Role.admin]))
  @ApiOkResponse({ type: RoleListResponse })
  findAll(@Req() request: Record<string, any>) {
    const { business_id } = request.headers;
    return this.rolesService.findAllRoles(+business_id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.rolesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }
}
