/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BusinessAccessInterceptor } from 'src/transactions/interceptors/business-access-interceptor';
// import { Bus } from 'src/utils/interceptors/business-access.interceptor';

@Controller('meals')
@ApiTags('Meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  // @Get()
  // findAll() {
  //   return this.mealsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.mealsService.findOne(+id);
  // }
}

@Controller('admin/meals')
@ApiTags('Meals (Admin)')
@ApiHeader({
  name: 'business_id',
  required: true,
  description: 'This is the business id',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(BusinessAccessInterceptor)
export class AdminMealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @ApiCreatedResponse()
  createMeal(@Body() createMealDto: CreateMealDto, @Req() request) {
    const { business_id } = request.headers;
    return this.mealsService.createMeal(createMealDto, +business_id);
  }

  @Get()
  async findAll(@Req() request) {
    const { business_id } = request.headers;
    // const baseUrl = request.protocol + "://" + request.headers.host;
    // const meals = (await this.mealsService.findAll(+business_id)).map(meal => {
    //   meal.image = `${baseUrl}/v2/files/image/${meal.image}`;
    //   return meal;
    // });
    const meals = await this.mealsService.findAll(+business_id);
    return {
      message: 'Menu fetch successful',
      status: 'success',
      data: meals,
    };
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() updateMealDto: UpdateMealDto,
    @Req() request,
  ) {
    const { business_id } = request.headers;
    return this.mealsService.update(+id, updateMealDto, +business_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request) {
    const { business_id } = request.headers;
    return this.mealsService.remove(+id, +business_id);
  }
}
