import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { BASE_MESSAGE } from "src/configs/messages";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it(`should return "${BASE_MESSAGE}"`, () => {
      expect(appController.getBaseMessage().message).toBe(BASE_MESSAGE);
    });
  });
});
