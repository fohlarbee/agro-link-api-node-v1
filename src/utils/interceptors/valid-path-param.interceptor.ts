import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, catchError } from "rxjs";

@Injectable()
export class ValidPathParamInterceptor implements NestInterceptor {
  constructor(private name: string = "id") {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const parsedParam = +request.params(this.name);
    if (isNaN(parsedParam) || parsedParam < 1)
      throw new BadRequestException(
        `Expected positive number for path ${this.name}`,
      );
    return next.handle().pipe(
      catchError((error) => {
        throw error;
      }),
    );
  }
}
