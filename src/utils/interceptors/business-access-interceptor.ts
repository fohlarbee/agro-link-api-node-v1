import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BusinessAccessInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers["business_id"])
      throw new BadRequestException("Missing required header: business_id");
    const businessId = parseInt(request.headers["business_id"], 10);
    const { id: userId } = request.user;
    if (isNaN(businessId) || businessId < 1)
      throw new BadRequestException(
        `Expected positive number for required header: business_id`,
      );
    console.log(userId, businessId);

    const staff = await this.prisma.staff.findUnique({
      where: { userId_businessId: { userId, businessId } },
    });
    console.log("here");

    if (!staff) throw new UnauthorizedException(`Invalid business`);

    return next.handle().pipe(
      catchError((error) => {
        throw error;
      }),
    );
  }
}
