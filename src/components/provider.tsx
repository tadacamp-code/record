"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AlertDialogProvider } from "@/components/ui/alert-dialog-provider";
import { toast } from "sonner";

const queryClient = new QueryClient({
    defaultOptions:{
        mutations:{
            onError:(e)=>{
                if (e.message === "NEXT_REDIRECT") return;
                toast.error(e.message);
            },
            onSuccess: () => {
               toast.success("Operation was successfully");      
            },
        },
    },
});

type ProvidersProps = {
    children: ReactNode;
};
const Providers = ({ children } : ProvidersProps) => {
    return(
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                 <Toaster />
                 <AlertDialogProvider />
                {children}
            </NextThemesProvider>
        </QueryClientProvider>
    );
};

export { Providers };