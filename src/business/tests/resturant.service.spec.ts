import { Test, TestingModule } from "@nestjs/testing";
import { RestaurantService } from "../business.service";

describe("RestaurantService", () => {
  let service: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantService]
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
