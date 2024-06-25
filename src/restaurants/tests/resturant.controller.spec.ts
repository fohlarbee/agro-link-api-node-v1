import { Test, TestingModule } from '@nestjs/testing';
import { ClientRestaurantController } from '../restaurant.controller';
import { RestaurantService } from '../restaurant.service';

describe('RestaurantController', () => {
  let controller: ClientRestaurantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientRestaurantController],
      providers: [RestaurantService],
    }).compile();

    controller = module.get<ClientRestaurantController>(ClientRestaurantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
