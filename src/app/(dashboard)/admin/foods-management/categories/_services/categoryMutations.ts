"use server";
import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";
import { CategorySchema } from "../_types/categorySchema";
import { requireRole } from "@/lib/authz";
import { Role } from "$/generated/prisma";

const deleteCategory = async(id: number) => {
    await executeAction({
        actionFn: async () => {
            await requireRole(Role.ADMIN);
            await db.category.delete({where: { id } });
        },
    });
};

const createCategory = async (data:CategorySchema ) => {
    await executeAction({
        actionFn: async () => {
            await requireRole(Role.ADMIN);
            await db.category.create({
            data:{
                name: data.name,

            } 
            });
        },
    });
};

const updateCategory = async (data:CategorySchema) => {
    if (data.action === "update"){
         await executeAction({
            actionFn: async () => {
                await requireRole(Role.ADMIN);
                await db.category.update({
                    where: {id: data.id},
                    data: {
                        name: data.name,
                    }
                });
            },
         });
    }
};


export{ deleteCategory ,createCategory ,updateCategory};
