import { Role } from "$/generated/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "./_components/sign-in-form";


const Page = async() => {
    const session = await auth();
    if (session?.user.role === Role.ADMIN){
        redirect("/admin/foods-management/foods");
    }

    if(session?.user.role === Role.USER){
        redirect("/client");
    }

    return(
        <div className="flex min-h-screen items-center justify-center">
            <SignInForm />
        </div>
    );
};



export default Page;