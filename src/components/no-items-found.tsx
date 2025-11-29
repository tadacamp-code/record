import { CircleOff } from "lucide-react";
import { Button } from "@/components/ui/button";


type NoItemsFoundProps = {
    onClick: () => void;
}

const NoItemsFound = ({onClick}:NoItemsFoundProps) => {
    return(
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <CircleOff className="text-primary mb-2"/>
            <h3 className="text-lg font-medium">No Items Found</h3>
            <p className="text-foreground/60 mt-1 text-sm">Try Add New Items</p>
            <Button variant="outline" className="mt-4" onClick={onClick}>
                Add New Item
            </Button>
        </div>
    );
};

export { NoItemsFound };