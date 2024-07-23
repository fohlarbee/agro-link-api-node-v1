import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";
import { Role } from "../dto/auth.dto";

const RoleGuard = (roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<any>();
      const user = request.user;

      return roles.includes(user?.role);
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
