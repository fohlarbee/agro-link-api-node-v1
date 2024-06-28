/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BarItemsService {
    constructor(private readonly prisma : PrismaService){}

    create(createBarItemsDto:Prisma.BarItemsCreateInput){
        return this.prisma.barItems.create({
            data:createBarItemsDto
        })

    }


    findAll(query?: string ){
        if(query){
            return this.prisma.barItems.findMany({
                where:{
                    name:{
                        contains:query
                    }
                }
            })
        }
        return this.prisma.barItems.findMany();
    }

    find(id:number){
        return this.prisma.barItems.findUnique({
            where:{
                id
            }
        })
    }
    update(id:number , updateBarItemsDto:Prisma.BarItemsUpdateInput   ){
        return this.prisma.barItems.update({
            where:{
                id
            },
            data:updateBarItemsDto
        })
    }
    remove(id:number){
        return this.prisma.barItems.delete({
            where:{
                id
            }
        })
    }
}
