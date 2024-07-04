/* -disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { BarController } from './bar.controller';

describe('BarController', () => {
  let controller: BarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarController],
    }).compile();

    controller = module.get<BarController>(BarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
