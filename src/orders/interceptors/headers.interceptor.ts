import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HeadersInterceptor implements NestInterceptor {
    constructor(private prisma: PrismaService) {}
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const restaurantId = request.headers['cm-restaurant-id'] as number;
        if (!restaurantId) throw new BadRequestException('Missing required header: cm-restaurant-id');
        if (isNaN(restaurantId) || restaurantId < 1) throw new BadRequestException(`Expected positive number for required header: cm-restaurant-id`);

        const dbRestaurant = await this.prisma.restaurant.findUnique({
            where: { id: +restaurantId }
        });

        if (!dbRestaurant) throw new BadRequestException(`Invalid restaurant id`);

        context.switchToHttp().getRequest().restaurant = dbRestaurant;

        return next.handle().pipe(
            catchError((error) => {
                throw error;
            }),
        );
    }
}
