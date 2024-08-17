import { Controller, Get, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { ApiBearerAuth, ApiHeader, ApiParam, ApiTags } from "@nestjs/swagger";
import { BusinessAccessInterceptor } from "src/utils/interceptors/business-access-interceptor";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import RoleGuard from "src/auth/role/role.guard";
import { Role } from "src/auth/dto/auth.dto";

@Controller("/admin/analytics")
@ApiTags("Admin Analytics")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard, RoleGuard([Role.admin]))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiParam({
    name: "duration",
    required: false,
  })
  findAll(@Req() request) {
    const { id: creatorId } = request.user;
    const { duration } = request.params;
    return this.analyticsService.findAllAnalytics(+creatorId, duration);
  }
}
