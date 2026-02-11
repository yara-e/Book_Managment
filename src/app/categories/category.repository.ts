import {prisma} from "../../common/db/prisma"
import type { createCatrgory , updateCategory } from "./category.types"

export const findAllCategoriesRepo=()=>{
    return prisma.category.findMany()
}
export const findCategoryRepo=(id:number)=>{
return prisma.category.findFirst({
    where:{id}
})
}

export const createCategoryRepo =(data:createCatrgory)=>{
    return prisma.category.create({
        data
    })
}

export const updateCategoryRepo=( id:number , data:updateCategory)=>{
return prisma.category.update({
    where:{id},
    data
})
}

export const deleteCategoryRepo=(id:number)=>{
    return prisma.category.delete({
        where:{id}
    })
}

export const countBooks=(categoryId: number)=> {
  return prisma.book.count({
    where: { categoryId }
  })
}