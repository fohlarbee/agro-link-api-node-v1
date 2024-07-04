import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AssignShiftTablesDto } from './dto/assign-shift-tables.dto';
import {
  ShiftCreationResponse,
  ShiftListResponse,
} from './entities/shift.entity';
import { BaseResponse } from 'src/app/entities/BaseResponse.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BusinessAccessInterceptor } from 'src/transactions/interceptors/business-access-interceptor';

@Controller('admin/shifts')
@ApiTags('Shifts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader({
  name: 'business_id',
  required: true,
  description: "This is the business's id",
})
@UseInterceptors(BusinessAccessInterceptor)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @ApiCreatedResponse({ type: ShiftCreationResponse })
  create(
    @Body() createShiftDto: CreateShiftDto,
    @Req() request: Record<string, any>,
  ) {
    const { business_id } = request.headers;
    return this.shiftsService.createShift(+business_id, createShiftDto);
  }

  @Get()
  @ApiOkResponse({ type: ShiftListResponse })
  findAll(CreateShiftDto, @Req() request: Record<string, any>) {
    const { business_id } = request.headers;
    return this.shiftsService.findAllShifts(+business_id);
  }

  @Post('/:id/assign-tables')
  @ApiOkResponse({ type: BaseResponse })
  assignTables(
    @Param('id') shiftId: string,
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
