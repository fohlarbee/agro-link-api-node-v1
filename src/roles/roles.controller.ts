import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleCreationResponse, RoleListResponse } from './entities/role.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('admin/roles')
@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader({ 
  name: "business_id", 
  required: true, 
  description: "This is the restaurant's id", 
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOkResponse({ type: RoleCreationResponse })
  create(@Body() createRoleDto: CreateRoleDto, @Req() request: Record<string, any>) {
    const { business_id } = request.headers;
    return this.rolesService.createRole(+business_id, createRoleDto);
  }

  @Get()
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
