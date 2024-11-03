import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  Put,
} from "@nestjs/common";
import { ShiftsService } from "./shifts.service";
import { CreateShiftDto, UpdatePeriodDto } from "./dto/create-shift.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AssignShiftTablesDto } from "./dto/assign-shift-tables.dto";
import {
  ShiftCreationResponse,
  ShiftListResponse,
} from "./entities/shift.entity";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { BusinessAccessInterceptor } from "src/utils/interceptors/business-access-interceptor";
import { Role } from "src/auth/dto/auth.dto";
import RoleGuard from "src/auth/role/role.guard";

@Controller("shifts")
@ApiTags("Shifts")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@ApiHeader({
  name: "business_id",
  required: true,
  description: "This is the business's id",
})
@UseInterceptors(BusinessAccessInterceptor)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @UseGuards(RoleGuard([Role.admin]))
  @ApiCreatedResponse({ type: ShiftCreationResponse })
  create(
    @Body() createShiftDto: CreateShiftDto,
    @Req() request: Record<string, any>,
  ) {
    const { business_id } = request.headers;
    return this.shiftsService.createShift(+business_id, createShiftDto);
  }

  @Get()
  @UseGuards(RoleGuard([Role.admin, Role.attendant]))
  @ApiOkResponse({ type: ShiftListResponse })
  findAll(CreateShiftDto, @Req() request: Record<string, any>) {
    const { business_id } = request.headers;
    return this.shiftsService.findAllShifts(+business_id);
  }

  @Post(":id/assign/tables")
  @UseGuards(RoleGuard([Role.admin]))
  // @UseInterceptors(new ValidPathParamInterceptor())
  @ApiOkResponse({ type: BaseResponse })
  assignTables(
    @Param("id") shiftId: string,
    @Body() { tableIds }: AssignShiftTablesDto,
    @Req() request: Record<string, any>,
  ) {
    const { business_id } = request.headers;
    return this.shiftsService.assignShiftTables(
      +business_id,
      +shiftId,
      tableIds,
    );
  }

  @Put(":id/period")
  async updatePeriod(@Req() request, @Body() updateDto: UpdatePeriodDto) {
    const { period_id } = request.headers;
    return this.shiftsService.updatePeriod(+period_id, updateDto);
  }
}
