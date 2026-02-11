import {prisma} from "../../common/db/prisma"
import { createBook , updateBook } from "./book.types";

export const findAllBooksRepo=()=>{
    return prisma.book.findMany({
        include: {category : true}
    })
}

export const findBookRepo = (id:number)=>{
    return prisma.book.findFirst({
        where:{id},
        include:{category:true}
    })
}

export const createBookRepo = (data:createBook)=>{
    return prisma.book.create({
        data
    })
}

export const updateBookRepo = (id:number,data:updateBook)=>{
    return prisma.book.update({
where:{id},
data
    })
}

export const deleteBookRepo = (id:number)=>{
    return prisma.book.delete({
        where:{id}
    })
}