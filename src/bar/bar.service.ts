import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BarService {
    constructor(private readonly prisma:PrismaService){}

    create(createBarItemDto:Prisma.BarCreateInput){
        return this.prisma.bar.create({
            data:createBarItemDto
        })

    }


    findAll(query?: string ){
        if(query){
            return this.prisma.bar.findMany({
                where:{
                    name:{
                        contains:query
                    }
                }
            })
        }
        return this.prisma.bar.findMany();
    }

    find(id:number){
        return this.prisma.bar.findUnique({
            where:{
                id
            }
        })
    }
    update(id:number , updateBarItemDto:Prisma.BarUpdateInput   ){
        return this.prisma.bar.update({
            where:{
                id
            },
            data:updateBarItemDto
        })
    }
    remove(id:number){
        return this.prisma.bar.delete({
            where:{
                id
            }
        })
    }
}
