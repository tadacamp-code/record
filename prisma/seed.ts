import { PrismaClient, Role } from "$/generated/prisma";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  const adminEmail = "super@admin.com";
  const demoEmail = "user@record.com";

  const hashedPassword = await bcrypt.hash("TrAiL19821127!@#", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      name: "Demo User",
      email: demoEmail,
      password: hashedPassword,
      role: Role.USER,
    },
  });

  return { admin, demoUser };
}

async function seedReferenceData() {
  // 清空与食物相关的表，避免重复数据
  await prisma.mealFood.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.foodServingUnit.deleteMany();
  await prisma.food.deleteMany();
  await prisma.category.deleteMany();
  await prisma.servingUnit.deleteMany();

  const servingUnitsData = [
    "gram",
    "ml",
    "cup",
    "piece",
    "slice",
    "tbsp",
    "tsp",
    "can",
  ];

  const servingUnits = await Promise.all(
    servingUnitsData.map((name) =>
      prisma.servingUnit.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const servingUnitByName = servingUnits.reduce<Record<string, number>>(
    (acc, unit) => {
      acc[unit.name] = unit.id;
      return acc;
    },
    {},
  );

  const categoriesData = [
    "Fruits",
    "Vegetables",
    "Proteins",
    "Grains",
    "Dairy",
    "Beverages",
    "Snacks",
  ];

  const categories = await Promise.all(
    categoriesData.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const categoryByName = categories.reduce<Record<string, number>>(
    (acc, category) => {
      acc[category.name] = category.id;
      return acc;
    },
    {},
  );

  const foodsData = [
    {
      name: "Banana",
      category: "Fruits",
      calories: 105,
      protein: 1.3,
      fat: 0.4,
      carbohydrates: 27,
      fiber: 3.1,
      sugar: 14,
    },
    {
      name: "Apple",
      category: "Fruits",
      calories: 95,
      protein: 0.5,
      fat: 0.3,
      carbohydrates: 25,
      fiber: 4.4,
      sugar: 19,
    },
    {
      name: "Orange",
      category: "Fruits",
      calories: 62,
      protein: 1.2,
      fat: 0.2,
      carbohydrates: 15.4,
      fiber: 3.1,
      sugar: 12,
    },
    {
      name: "Broccoli",
      category: "Vegetables",
      calories: 55,
      protein: 3.7,
      fat: 0.6,
      carbohydrates: 11.2,
      fiber: 5.1,
      sugar: 2.2,
    },
    {
      name: "Spinach",
      category: "Vegetables",
      calories: 23,
      protein: 2.9,
      fat: 0.4,
      carbohydrates: 3.6,
      fiber: 2.2,
      sugar: 0.4,
    },
    {
      name: "Chicken Breast",
      category: "Proteins",
      calories: 165,
      protein: 31,
      fat: 3.6,
      carbohydrates: 0,
      fiber: 0,
      sugar: 0,
    },
    {
      name: "Salmon",
      category: "Proteins",
      calories: 206,
      protein: 22,
      fat: 12,
      carbohydrates: 0,
      fiber: 0,
      sugar: 0,
    },
    {
      name: "Tofu",
      category: "Proteins",
      calories: 144,
      protein: 15.7,
      fat: 8,
      carbohydrates: 3.9,
      fiber: 2.3,
      sugar: 1.9,
    },
    {
      name: "Egg",
      category: "Proteins",
      calories: 78,
      protein: 6.3,
      fat: 5.3,
      carbohydrates: 0.6,
      fiber: 0,
      sugar: 0.6,
    },
    {
      name: "Brown Rice",
      category: "Grains",
      calories: 216,
      protein: 5,
      fat: 1.8,
      carbohydrates: 45,
      fiber: 3.5,
      sugar: 1,
    },
    {
      name: "Oatmeal",
      category: "Grains",
      calories: 154,
      protein: 6,
      fat: 2.5,
      carbohydrates: 27,
      fiber: 4,
      sugar: 1,
    },
    {
      name: "Whole Wheat Bread",
      category: "Grains",
      calories: 110,
      protein: 4,
      fat: 1,
      carbohydrates: 20,
      fiber: 3,
      sugar: 4,
    },
    {
      name: "Greek Yogurt",
      category: "Dairy",
      calories: 100,
      protein: 17,
      fat: 0,
      carbohydrates: 6,
      fiber: 0,
      sugar: 4,
    },
    {
      name: "Milk 2%",
      category: "Dairy",
      calories: 122,
      protein: 8,
      fat: 4.8,
      carbohydrates: 12,
      fiber: 0,
      sugar: 12,
    },
    {
      name: "Black Coffee",
      category: "Beverages",
      calories: 2,
      protein: 0.3,
      fat: 0,
      carbohydrates: 0,
      fiber: 0,
      sugar: 0,
    },
    {
      name: "Green Tea",
      category: "Beverages",
      calories: 2,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      fiber: 0,
      sugar: 0,
    },
    {
      name: "Almonds",
      category: "Snacks",
      calories: 164,
      protein: 6,
      fat: 14,
      carbohydrates: 6,
      fiber: 3.5,
      sugar: 1.2,
    },
    {
      name: "Peanut Butter",
      category: "Snacks",
      calories: 188,
      protein: 8,
      fat: 16,
      carbohydrates: 6,
      fiber: 2,
      sugar: 3,
    },
  ];

  const foods = await Promise.all(
    foodsData.map((food) =>
      prisma.food.upsert({
        where: { name: food.name },
        update: {},
        create: {
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          fat: food.fat,
          carbohydrates: food.carbohydrates,
          fiber: food.fiber,
          sugar: food.sugar,
          categoryId: categoryByName[food.category],
        },
      }),
    ),
  );

  const foodByName = foods.reduce<Record<string, number>>((acc, food) => {
    acc[food.name] = food.id;
    return acc;
  }, {});

  const foodServingUnitsData = [
    { food: "Banana", unit: "gram", grams: 1 },
    { food: "Banana", unit: "piece", grams: 118 },
    { food: "Apple", unit: "gram", grams: 1 },
    { food: "Apple", unit: "piece", grams: 182 },
    { food: "Orange", unit: "gram", grams: 1 },
    { food: "Orange", unit: "piece", grams: 140 },
    { food: "Broccoli", unit: "gram", grams: 1 },
    { food: "Broccoli", unit: "cup", grams: 91 },
    { food: "Spinach", unit: "gram", grams: 1 },
    { food: "Spinach", unit: "cup", grams: 30 },
    { food: "Chicken Breast", unit: "gram", grams: 1 },
    { food: "Chicken Breast", unit: "piece", grams: 120 },
    { food: "Salmon", unit: "gram", grams: 1 },
    { food: "Salmon", unit: "piece", grams: 170 },
    { food: "Tofu", unit: "gram", grams: 1 },
    { food: "Tofu", unit: "piece", grams: 85 },
    { food: "Egg", unit: "gram", grams: 1 },
    { food: "Egg", unit: "piece", grams: 50 },
    { food: "Brown Rice", unit: "gram", grams: 1 },
    { food: "Brown Rice", unit: "cup", grams: 195 },
    { food: "Oatmeal", unit: "gram", grams: 1 },
    { food: "Oatmeal", unit: "cup", grams: 234 },
    { food: "Whole Wheat Bread", unit: "gram", grams: 1 },
    { food: "Whole Wheat Bread", unit: "slice", grams: 28 },
    { food: "Greek Yogurt", unit: "gram", grams: 1 },
    { food: "Greek Yogurt", unit: "cup", grams: 150 },
    { food: "Milk 2%", unit: "ml", grams: 1 },
    { food: "Milk 2%", unit: "cup", grams: 240 },
    { food: "Black Coffee", unit: "ml", grams: 1 },
    { food: "Black Coffee", unit: "cup", grams: 240 },
    { food: "Green Tea", unit: "ml", grams: 1 },
    { food: "Green Tea", unit: "cup", grams: 240 },
    { food: "Almonds", unit: "gram", grams: 1 },
    { food: "Almonds", unit: "tbsp", grams: 9 },
    { food: "Peanut Butter", unit: "gram", grams: 1 },
    { food: "Peanut Butter", unit: "tbsp", grams: 16 },
  ];

  await prisma.foodServingUnit.createMany({
    data: foodServingUnitsData.map((entry) => ({
      foodId: foodByName[entry.food],
      servingUnitId: servingUnitByName[entry.unit],
      grams: entry.grams,
    })),
    skipDuplicates: true,
  });

  return { foodByName, servingUnitByName };
}

async function seedMeals(userId: number, refs: { foodByName: Record<string, number>; servingUnitByName: Record<string, number> }) {
  const mealsData = [
    {
      dateTime: "2025-01-10T08:00:00.000Z",
      foods: [
        { food: "Oatmeal", unit: "cup", amount: 1 },
        { food: "Banana", unit: "piece", amount: 1 },
        { food: "Milk 2%", unit: "cup", amount: 1 },
        { food: "Black Coffee", unit: "cup", amount: 1 },
      ],
    },
    {
      dateTime: "2025-01-10T12:30:00.000Z",
      foods: [
        { food: "Chicken Breast", unit: "gram", amount: 150 },
        { food: "Brown Rice", unit: "cup", amount: 1 },
        { food: "Broccoli", unit: "cup", amount: 1 },
        { food: "Spinach", unit: "cup", amount: 1 },
      ],
    },
    {
      dateTime: "2025-01-10T16:00:00.000Z",
      foods: [
        { food: "Greek Yogurt", unit: "cup", amount: 1 },
        { food: "Almonds", unit: "gram", amount: 28 },
        { food: "Peanut Butter", unit: "tbsp", amount: 1 },
      ],
    },
    {
      dateTime: "2025-01-10T19:00:00.000Z",
      foods: [
        { food: "Salmon", unit: "gram", amount: 170 },
        { food: "Brown Rice", unit: "cup", amount: 0.75 },
        { food: "Spinach", unit: "cup", amount: 1 },
        { food: "Orange", unit: "piece", amount: 1 },
      ],
    },
    {
      dateTime: "2025-01-11T08:30:00.000Z",
      foods: [
        { food: "Tofu", unit: "gram", amount: 120 },
        { food: "Whole Wheat Bread", unit: "slice", amount: 2 },
        { food: "Green Tea", unit: "cup", amount: 1 },
        { food: "Apple", unit: "piece", amount: 1 },
      ],
    },
    {
      dateTime: "2025-01-11T12:00:00.000Z",
      foods: [
        { food: "Egg", unit: "piece", amount: 2 },
        { food: "Oatmeal", unit: "cup", amount: 0.5 },
        { food: "Milk 2%", unit: "cup", amount: 0.5 },
        { food: "Banana", unit: "piece", amount: 0.5 },
      ],
    },
  ];

  for (const meal of mealsData) {
    await prisma.meal.create({
      data: {
        dateTime: new Date(meal.dateTime),
        userId,
        mealFoods: {
          create: meal.foods.map((item) => ({
            foodId: refs.foodByName[item.food],
            servingUnitId: refs.servingUnitByName[item.unit],
            amount: item.amount,
          })),
        },
      },
    });
  }
}

async function main() {
  const { admin, demoUser } = await seedUsers();
  const refs = await seedReferenceData();
  await seedMeals(demoUser.id, refs);

  console.log("Seed data inserted successfully. Admin:", admin.email, "User:", demoUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
