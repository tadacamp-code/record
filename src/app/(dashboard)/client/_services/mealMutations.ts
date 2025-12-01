"use server";

import {
  mealSchema,
  MealSchema,
} from "@/app/(dashboard)/client/_types/mealSchema";
import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";
import { toNumberSafe } from "@/lib/utils";
import { requireAuth, requireUserMatch } from "@/lib/authz";

const createMeal = async (data: MealSchema) => {
  await executeAction({
    actionFn: async () => {
      const session = await requireAuth();
      const validatedData = mealSchema.parse({
        ...data,
        userId: session.user.id,
      });

      const meal = await db.meal.create({
        data: {
          userId: toNumberSafe(session.user.id),
          dateTime: validatedData.dateTime,
        },
      });

      await Promise.all(
        validatedData.mealFoods.map(async (food) => {
          await db.mealFood.create({
            data: {
              mealId: meal.id,
              foodId: toNumberSafe(food.foodId),
              amount: toNumberSafe(food.amount),
              servingUnitId: toNumberSafe(food.servingUnitId),
            },
          });
        }),
      );
    },
  });
};

const updateMeal = async (data: MealSchema) => {
  await executeAction({
    actionFn: async () => {
      const session = await requireAuth();
      const validatedData = mealSchema.parse({
        ...data,
        userId: session.user.id,
      });

      if (validatedData.action === "update") {
        const existingMeal = await db.meal.findUnique({
          where: { id: validatedData.id },
          select: { userId: true },
        });

        if (!existingMeal) {
          throw new Error("Meal not found");
        }

        await requireUserMatch(existingMeal.userId);

        await db.meal.update({
          where: { id: validatedData.id },
          data: {
            dateTime: validatedData.dateTime,
          },
        });

        await db.mealFood.deleteMany({
          where: { mealId: validatedData.id },
        });

        await Promise.all(
          validatedData.mealFoods.map(async (food) => {
            await db.mealFood.create({
              data: {
                mealId: validatedData.id,
                foodId: toNumberSafe(food.foodId),
                servingUnitId: toNumberSafe(food.servingUnitId),
                amount: toNumberSafe(food.amount),
              },
            });
          }),
        );
      }
    },
  });
};

const deleteMeal = async (id: number) => {
  await executeAction({
    actionFn: async () => {
      const session = await requireAuth();
      const mealOwner = await db.meal.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!mealOwner) {
        throw new Error("Meal not found");
      }

      await requireUserMatch(mealOwner.userId);

      await db.mealFood.deleteMany({
        where: { mealId: id },
      });

      await db.meal.delete({ where: { id } });
    },
  });
};

export { createMeal, deleteMeal, updateMeal };
