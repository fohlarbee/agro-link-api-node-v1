/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HotelsService {
    constructor(private readonly prisma:PrismaService){}

    create(createHotelDto:Prisma.HotelCreateInput){
        return this.prisma.hotel.create({
            data:createHotelDto
        })

    }


    findAll(query?: string ){
        if(query){
            return this.prisma.hotel.findMany({
                where:{
                    name:{
                        contains:query
                    }
                }
            })
        }
        return this.prisma.hotel.findMany();
    }

    find(id:number){
        return this.prisma.hotel.findUnique({
            where:{
                id
            }
        })
    }
    update(id:number , updateHotelDto:Prisma.HotelUpdateInput   ){
        return this.prisma.hotel.update({
            where:{
                id
            },
            data:updateHotelDto
        })
    }
    remove(id:number){
        return this.prisma.hotel.delete({
            where:{
                id
            }
        })
    }
}


