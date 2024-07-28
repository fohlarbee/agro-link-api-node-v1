import { Test, TestingModule } from "@nestjs/testing";
import { ClientBusinessController } from "../business.controller";
import { BusinessService } from "../business.service";

describe("BusinessController", () => {
  let controller: ClientBusinessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientBusinessController],
      providers: [BusinessService],
    }).compile();

    controller = module.get<ClientBusinessController>(ClientBusinessController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
