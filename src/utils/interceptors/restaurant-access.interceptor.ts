import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RestaurantAccessInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers['business_id'])
      throw new BadRequestException('Missing required header: business_id');
    const restaurantId = parseInt(request.headers['business_id'], 10);
    const { id: userId } = request.user;
    if (isNaN(restaurantId) || restaurantId < 1)
      throw new BadRequestException(
        `Expected positive number for required header: business_id`,
      );

    const staff = await this.prisma.staff.findUnique({
      where: { userId_restaurantId: { userId, restaurantId } },
    });

    if (!staff) throw new UnauthorizedException(`Invalid restaurant`);

    return next.handle().pipe(
      catchError((error) => {
        throw error;
      }),
    );
  }
}
