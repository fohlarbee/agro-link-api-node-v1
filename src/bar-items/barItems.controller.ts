/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { BarItemsService } from './barItems.service';
import { Prisma } from '@prisma/client';

@Controller('barItems')
export class BarItemsController {
    constructor(private readonly barItemService: BarItemsService){}

    @Post()
    create(@Body() createBarItemsDto: Prisma.BarItemsCreateInput){
        try {
            return this.barItemService.create(createBarItemsDto);
            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.BAD_REQUEST);
            
        }
    }

    @Get()
    fndAll(@Query('query') query?: string){
        try {
            return this.barItemService.findAll(query);
            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.BAD_REQUEST);
  
        }
    }
    @Get(':id')
    findOne(@Param('id') id:string){
        try {
            return this.barItemService.find(+id);
            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.NOT_FOUND);

            
        }
    }

@Patch(':id')
update(@Param('id') id:string,  @Body() updateBarItemDto:Prisma.BarItemsUpdateInput  ){
    try {
           return this.barItemService.update(+id, updateBarItemDto)

        
    } catch (error) {
        throw new HttpException('An error occured', HttpStatus.NOT_FOUND);
    }
}


    @Delete(':id')
    remove(@Param('id') id:string){
        try {
               return this.barItemService.remove(+id);

            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.NOT_FOUND);    
        }
}
}
