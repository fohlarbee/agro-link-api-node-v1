import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import RoleGuard from "src/auth/role/role.guard";
import { Role } from "src/auth/dto/auth.dto";

enum Duration {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

@Controller("/admin/analytics")
@ApiTags("Admin Analytics")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard, RoleGuard([Role.admin]))
@ApiQuery({
  name: "duration",
  required: false,
  enum: Duration,
})
@ApiQuery({
  name: "length",
  required: false,
  type: "number",
})
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  findAll(
    @Req() request,
    @Query("duration") duration: Duration,
    @Query("length") length = 1,
  ) {
    const { id: creatorId } = request.user;
    return this.analyticsService.findAllAnalytics(
      +creatorId,
      duration,
      +length,
    );
  }

  @Get("/staffs")
  findStaffAnalytics(
    @Req() request,
    @Query("duration") duration: Duration,
    @Query("length") length = 1,
  ) {
    const { id: creatorId } = request.user;
    return this.analyticsService.findStaffAnalytics(
      +creatorId,
      duration,
      +length,
    );
  }
}
