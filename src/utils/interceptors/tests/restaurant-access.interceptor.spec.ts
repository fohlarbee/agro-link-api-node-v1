import { PrismaService } from "src/prisma/prisma.service";
import { BusinessAccessInterceptor } from "../business-access-interceptor";

describe("BusinessAccessInterceptor", () => {
  it("should be defined", () => {
    expect(new BusinessAccessInterceptor(new PrismaService())).toBeDefined();
  });
});
