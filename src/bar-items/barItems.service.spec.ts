import { Test, TestingModule } from '@nestjs/testing';
import { BarItemsService } from './barItems.service';

describe('BarItemsService', () => {
  let service: BarItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarItemsService],
    }).compile();

    service = module.get<BarItemsService>(BarItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
