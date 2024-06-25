import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HeadersInterceptor implements NestInterceptor {
    constructor(private prisma: PrismaService) {}
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        // const request = context.switchToHttp().getRequest();
        // const role = request.headers['cm-user-role'] as string;
        // if (!role) throw new BadRequestException('Missing required header: cm-user-role');

        // const dbRole = await this.prisma.role.findUnique({
        //     where: { name: role.toLocaleLowerCase() }
        // });

        // if (!dbRole) throw new BadRequestException(`Invalid value '${role}' for cm-user-role.`);

        // context.switchToHttp().getRequest().userRole = dbRole;

        return next.handle().pipe(
            catchError((error) => {
                throw error;
            }),
        );
    }
}
