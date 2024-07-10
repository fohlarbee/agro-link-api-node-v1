import { Test, TestingModule } from "@nestjs/testing";
import { OptionController } from "../options.controller";
import { OptionService } from "../options.service";

describe("OptionsController", () => {
  let controller: OptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionController],
      providers: [OptionService]
    }).compile();

    controller = module.get<OptionController>(OptionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
