/* -disable @typescript-/no-unused-vars */
/* -disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { BarService } from "./bar.service";
import { Prisma } from "@prisma/client";

@Controller("bars")
export class BarController {
  // -disable-next-line prettier/prettier
    constructor(
        private readonly barsService: BarService,
    ){}

    @Post()
    create(@Body() createBarItemDto: Prisma.BarCreateInput){
        try {
            return this.barsService.create(createBarItemDto);
            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.BAD_REQUEST);
            
        }
    }

    @Get()
    fndAll(@Query('query') query?: string){
        try {
            return this.barsService.findAll(query);
            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.BAD_REQUEST);
  
        }
    }
    @Get(':id')
    findOne(@Param('id') id:string){
        try {
            return this.barsService.find(+id);
            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.NOT_FOUND);

            
        }
    }

@Patch(':id')
update(@Param('id') id:string,  @Body() updateBarItemDto:Prisma.BarUpdateInput  ){
    try {
           return this.barsService.update(+id, updateBarItemDto)

        
    } catch (error) {
        throw new HttpException('An error occured', HttpStatus.NOT_FOUND);
    }
}


    @Delete(':id')
    remove(@Param('id') id:string){
        try {
               return this.barsService.remove(+id);

            
        } catch (error) {
            throw new HttpException('An error occured', HttpStatus.NOT_FOUND);    
        }
}
}