"use client";

import { FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { foodFilterDefaultValues, foodFiltersSchema, FoodFiltersSchema } from "@/app/(dashboard)/admin/foods-management/foods/_types/foodFilterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFoodsStore } from "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store";
import { useEffect, useMemo } from "react";
import equal from "fast-deep-equal";
import { useDebounce } from "@/lib/use-debounce";
import { useCategories } from "@/app/(dashboard)/admin/foods-management/categories/_services/use-category-queries";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ControlledInput } from "@/components/ui/controlled-input";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { ControlledSlider } from "@/components/ui/controlled-sliders";


const FoodFilterDrawer = () => {

    const form = useForm<FoodFiltersSchema>({
        defaultValues: foodFilterDefaultValues,
        resolver: zodResolver(foodFiltersSchema),
    });

    const {
        updateFoodFilters,
        foodFiltersDrawerOpen,
        updateFoodFiltersDrawerOpen,
        updateFoodFiltersSearchTerm,
        foodFilters,
    } = useFoodsStore();

    const areFiltersModified = useMemo(
        () => !equal(foodFilters,foodFilterDefaultValues),
        [foodFilters],
    );

    const searchTerm = useWatch({control:form.control, name: "searchTerm"});
    const debounceSearchTerm = useDebounce(searchTerm,400);

    useEffect(() => {
        updateFoodFiltersSearchTerm(debounceSearchTerm);
    },[debounceSearchTerm,updateFoodFiltersSearchTerm]);

    const categoriesQuery = useCategories();

    useEffect(()=>{
        if(!foodFiltersDrawerOpen){
            form.reset();
        }
    },[foodFilters,foodFiltersDrawerOpen,form]);

    const onSubmit:SubmitHandler<FoodFiltersSchema> = (data) => {
        updateFoodFilters(data);
        updateFoodFiltersDrawerOpen(false);
    }

    return(
       <Drawer
        open={foodFiltersDrawerOpen}
        onOpenChange={updateFoodFiltersDrawerOpen}
        direction="right"
        handleOnly
       >
            <FormProvider {...form}>
                <div className="flex gap-2">
                    <ControlledInput<FoodFiltersSchema> 
                        containerClassName="max-w-48" 
                        name="searchTerm" 
                        placeholder="Quick Search"
                     />
                     <DrawerTrigger asChild>
                        <Button variant="outline">
                            <FilterIcon />
                            Filters
                        </Button>
                     </DrawerTrigger>
                </div>

                <form>
                    <DrawerContent>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>Filters</DrawerTitle>
                            <DrawerDescription>
                                Customize you food search criteria
                            </DrawerDescription>
                        </DrawerHeader>

                        <div className="space-y-2 p-4">
                             <ControlledSelect<FoodFiltersSchema>
                                    label="Category"
                                    name="categoryId"
                                    clearable
                                    options={categoriesQuery.data?.map((item) => ({
                                                value: item.id,
                                                label: item.name,
                                            }))}
                                />

                                <ControlledSelect<FoodFiltersSchema>
                                    label="Sort By"
                                    name="sortBy"
                                    options={[
                                        { label: "Name", value: "name" },
                                        { label: "Calories", value: "calories" },
                                        { label: "Carbohydrates", value: "carbohydrates" },
                                        { label: "Fat", value: "fat" },
                                        { label: "Protein", value: "protein" },
                                    ]}
                                />

                                <ControlledSelect<FoodFiltersSchema>
                                    label="Sort Order"
                                    name="sortOrder"
                                    options={[
                                        { label: "Ascending", value: "asc" },
                                        { label: "Descending", value: "desc" },
                                    ]}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <ControlledSlider<FoodFiltersSchema>
                                    name="caloriesRange"
                                    label="Calories"
                                    min={0}
                                    max={9999}
                                />
                
                                <ControlledSlider<FoodFiltersSchema>
                                    name="proteinRange"
                                    label="Protein"
                                    min={0}
                                    max={9999}
                                />
                        </div>
                        <DrawerFooter className="pt-2">
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={()=> form.reset(foodFilterDefaultValues)}
                            >
                                Reset
                            </Button>
                            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                                Apply Filter
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </form>
            </FormProvider>
       </Drawer>
    );
};

export { FoodFilterDrawer };