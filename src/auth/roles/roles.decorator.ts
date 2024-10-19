// import { SetMetadata } from "@nestjs/common";

// export const Roles = (...args: string[]) => SetMetadata("roles", args);

import { SetMetadata } from "@nestjs/common";
import { Role } from "../dto/auth.dto";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
