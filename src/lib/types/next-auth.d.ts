import type { Role } from "$/generated/prisma";
import { DefaultSession,DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth"{
    interface Session{
        user:{
            id: string;
            role: Role;
        } & DefaultSession["user"];
    }
    
    interface User extends DefaultUser{
        role: Role;
    }
}

declare module "next-auth/jwt"{
    interface JWT extends DefaultJWT{
        id: string | number;
        role: Role;
    }
}
