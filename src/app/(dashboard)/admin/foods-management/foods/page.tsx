import { FoodFormDialog } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-form-dialog";
import { FoodFilterDrawer } from "./_components/food-filters-drawer";
import { FoodCards } from "./_components/food-cards";

const Page = () => {
    return(
        <div className="space-y-2">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Food List</h1>
                <FoodFormDialog />
            </div>
            <FoodFilterDrawer/>
            <FoodCards />
        </div>
    );
};

export default Page;