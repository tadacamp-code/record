"use server";

import db from "@/lib/db";
import { CategorySchema } from "@/app/(dashboard)/admin/foods-management/categories/_types/categorySchema";


const getCategories = async () => {
    return await db.category.findMany();
}

const getCategory = async(id:number):Promise<CategorySchema> => {
    const res = await db.category.findFirst({
        where: { id },
    });

    return {
        ...res,
        action: "update",
        name: res?.name ?? "",
        id,
    };
};

export { getCategories, getCategory };