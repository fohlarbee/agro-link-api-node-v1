import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ShiftsService } from "./shifts.service";
import { CreateShiftDto } from "./dto/create-shift.dto";
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

@Controller("admin/shifts")
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
  @UseGuards(RoleGuard([Role.admin, Role.manager]))
  @ApiCreatedResponse({ type: ShiftCreationResponse })
  create(
    @Body() createShiftDto: CreateShiftDto,
    @Req() request: Record<string, any>,
  ) {
    const { business_id } = request.headers;
    return this.shiftsService.createShift(+business_id, createShiftDto);
  }

  @Get()
  @UseGuards(RoleGuard([Role.admin, Role.manager]))
  @UseGuards(RoleGuard([Role.admin, Role.manager, Role.waiter, Role.kitchen]))
  @ApiOkResponse({ type: ShiftListResponse })
  findAll(CreateShiftDto, @Req() request: Record<string, any>) {
    const { business_id } = request.headers;
    return this.shiftsService.findAllShifts(+business_id);
  }

  @Post("/:id/assign/tables")
  @UseGuards(RoleGuard([Role.admin, Role.manager]))
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.shiftsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
  //   return this.shiftsService.update(+id, updateShiftDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.shiftsService.remove(+id);
  // }
}
