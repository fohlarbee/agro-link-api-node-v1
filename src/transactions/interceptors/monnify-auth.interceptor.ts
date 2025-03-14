import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import * as crypto from "crypto";

@Injectable()
export class MonnifyAuthInterceptor implements NestInterceptor {
  constructor() {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const transactionPayload = JSON.stringify(request.body);
    const hash = crypto
      .createHmac("sha512", process.env.MONNIFY_SECRET_KEY)
      .update(transactionPayload)
      .digest("hex");
    if (hash != request.headers["monnify-signature"])
      throw new UnauthorizedException();
    return next.handle().pipe(
      catchError((error) => {
        throw error;
      }),
    );
  }
}
