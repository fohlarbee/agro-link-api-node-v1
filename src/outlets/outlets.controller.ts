import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { OutletsService } from "./outlets.service";
import { CreateOutletDto } from "./dto/create-outlet.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  OutletCreationResponse,
  OutletListResponse,
} from "./entities/outlet.entity";
import { CreateTableDto } from "./dto/create-table.dto";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { BusinessAccessInterceptor } from "src/utils/interceptors/business-access-interceptor";
import RoleGuard from "src/auth/role/role.guard";
import { Role } from "src/auth/dto/auth.dto";
@Controller("admin/outlets")
@ApiTags("Outlets")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@ApiHeader({
  name: "business_id",
  required: true,
  description: "This is the business id",
})
@UseInterceptors(BusinessAccessInterceptor)
export class OutletsController {
  constructor(private readonly outletsService: OutletsService) {}

  @Post()
  @UseGuards(RoleGuard([Role.admin]))
  @ApiCreatedResponse({ type: OutletCreationResponse })
  createOutlet(
    @Req() request: Record<string, any>,
    @Body() createData: CreateOutletDto,
  ) {
    const { business_id: businessId } = request.headers;
    return this.outletsService.createOutlet(+businessId, createData);
  }

  @Get()
  @ApiOkResponse({ type: OutletListResponse })
  findOutlets(@Req() request: Record<string, any>) {
    const { business_id: businessId } = request.headers;
    return this.outletsService.findOutlets(+businessId);
  }
}
