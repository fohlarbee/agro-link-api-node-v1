import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/app/entities/BaseResponse.entity';
import { StaffFetchResponse, StaffListResponse } from './entities/staff.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('admin/staffs')
@ApiTags("Staffs")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader({ 
  name: "business_id", 
  required: true, 
  description: "This is the restaurant's id", 
})
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Post()
  @ApiOkResponse({ type: BaseResponse })
  create(@Body() createStaffDto: CreateStaffDto, @Req() request: Record<string, any>) {
    const { business_id } = request.headers;
    return this.staffsService.createStaff(+business_id, createStaffDto);
  }

  @Get()
  @ApiOkResponse({ type: StaffListResponse })
  findAll(@Req() request: Record<string, any>) {
    const { business_id } = request.headers;
    return this.staffsService.findAllStaffs(+business_id);
  }

  @Get(':id')
  @ApiOkResponse({ type: StaffFetchResponse })
  findOne(@Param('id') id: string, @Req() request: Record<string, any>) {
    const { business_id } = request.headers;
    return this.staffsService.findStaff(+id, +business_id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
  //   return this.staffsService.update(+id, updateStaffDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.staffsService.remove(+id);
  // }
}
