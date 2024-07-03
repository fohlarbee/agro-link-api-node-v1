import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantAccessInterceptor } from '../business-access.interceptor';

describe('RestaurantAccessInterceptor', () => {
  it('should be defined', () => {
    expect(new RestaurantAccessInterceptor(new PrismaService())).toBeDefined();
  });
});
