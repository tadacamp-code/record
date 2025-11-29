import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory, deleteCategory, updateCategory } from "./categoryMutations";
import { toast } from "sonner";
import { CategorySchema } from "../_types/categorySchema";



const useDeleteCategory = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id:number) => {
            await deleteCategory(id);
        },
        onSuccess: () => {
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({queryKey: ["categories"]});
        }
    });
};


const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CategorySchema) => {
            await createCategory(data);
        },

        onSuccess: () => {
            toast.success("Category Created Successfully.");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CategorySchema) => {
            await updateCategory(data);
        },
        onSuccess: () => {
            toast.success("Category Updated Successfully.");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

export { useDeleteCategory, useCreateCategory, useUpdateCategory};