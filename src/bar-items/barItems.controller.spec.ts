/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { BarItemsController } from './barItems.controller';

describe('BarItemsController', () => {
  let controller: BarItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarItemsController],
    }).compile();

    controller = module.get<BarItemsController>(BarItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
