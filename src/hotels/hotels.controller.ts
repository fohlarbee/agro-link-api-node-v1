/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { Prisma } from '@prisma/client';

@Controller('hotels')
export class HotelsController {
    constructor(private readonly hotelService: HotelsService){}


    @Post()
    create(@Body() createHotelDto: Prisma.HotelCreateInput){
        try {
            return this.hotelService.create(createHotelDto);
            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.BAD_REQUEST);
            
        }
    }

    @Get()
    fndAll(@Query('query') query?: string){
        try {
            return this.hotelService.findAll(query);
            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.BAD_REQUEST);
  
        }
    }
    @Get(':id')
    findOne(@Param('id') id:string){
        try {
            return this.hotelService.find(+id);
            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.NOT_FOUND);

            
        }
    }

@Patch(':id')
update(@Param('id') id:string,  @Body() updateBarItemDto:Prisma.BarUpdateInput  ){
    try {
           return this.hotelService.update(+id, updateBarItemDto)

        
    } catch (error) {
        throw new HttpException('An error occured', HttpStatus.NOT_FOUND);
    }
}


    @Delete(':id')
    remove(@Param('id') id:string){
        try {
               return this.hotelService.remove(+id);

            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.NOT_FOUND);    
        }
}
}
