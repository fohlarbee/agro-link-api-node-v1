import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { StaffsService } from "./staffs.service";
import { CreateStaffDto } from "./dto/create-staff.dto";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { StaffFetchResponse, StaffListResponse } from "./entities/staff.entity";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { BusinessAccessInterceptor } from "src/utils/interceptors/business-access-interceptor";
import RoleGuard from "src/auth/role/role.guard";
import { Role } from "src/auth/dto/auth.dto";

@Controller("admin/staffs")
@ApiTags("Staffs")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@ApiHeader({
  name: "business_id",
  required: true,
  description: "This is the business's id",
})
@UseInterceptors(BusinessAccessInterceptor)
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Post()
  @UseGuards(RoleGuard([Role.admin]))
  @ApiOkResponse({ type: BaseResponse })
  create(
    @Body() createStaffDto: CreateStaffDto,
    @Req() request: Record<string, any>,
  ) {
    const { business_id } = request.headers;
    return this.staffsService.createStaff(+business_id, createStaffDto);
  }

  @Get()
  @UseGuards(RoleGuard([Role.admin, Role.attendant, Role.customer]))
  @ApiOkResponse({ type: StaffListResponse })
  findAll(@Req() request: Record<string, any>) {
    const { business_id } = request.headers;
    return this.staffsService.findAllStaffs(+business_id);
  }

  @Get(":id")
  @UseGuards(RoleGuard([Role.admin, Role.attendant, Role.customer]))
  @ApiOkResponse({ type: StaffFetchResponse })
  findOne(@Param("id") id: string, @Req() request: Record<string, any>) {
    const { business_id } = request.headers;
    return this.staffsService.findStaff(+id, +business_id);
  }

  @Get("waiter/:id/analytics")
  @UseGuards(RoleGuard([Role.admin, Role.attendant]))
  getWaiterAnalytics(
    @Param("id") id: string,
    @Req() request: Record<string, any>,
    @Query("sortBy") sortBy?: string,
  ) {
    const { business_id } = request.headers;
    return this.staffsService.waiterAnalytics(+id, +business_id, sortBy);
  }

  @Get("kitchen/:id/analytics")
  @UseGuards(RoleGuard([Role.admin, Role.attendant]))
  getKitchenStaffAnalytics(
    @Param("id") id: string,
    @Req() request: Record<string, any>,
    @Query("sortBy") sortBy?: string,
  ) {
    const { business_id } = request.headers;
    return this.staffsService.kitchenStaffAnalytics(+id, +business_id, sortBy);
  }
}
