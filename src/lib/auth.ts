import { signInSchema } from "@/app/(auth)/sign-in/_types/signInSchema";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "@/lib/db";
import { comparePassword, toNumberSafe, toStringSafe } from "@/lib/utils";


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers:[
        Credentials({
            credentials:{
                email: {},
                password: {},
            },

            authorize: async (credentials) => {
                if(!credentials.email || !credentials.password){
                    throw new Error("Email and password are required");
                }

                const validatedCredentials = signInSchema.parse(credentials);

                const user = await db.user.findUnique({
                    where: {
                        email: validatedCredentials.email,
                    },
                });

                if(!user){
                    throw new Error("Invalid email or password");
                }

                const isPasswordValid = await comparePassword(validatedCredentials.password,user.password);

                if(!isPasswordValid){
                    throw new Error("Invalid email or password");
                }

                return{
                    id: toStringSafe(user.id),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],

    pages:{
        signIn: "/sign-in",
    },

    callbacks: {
        jwt({token, user}){
            const cloneToken = token;
            if(user){
                cloneToken.id = toNumberSafe(user.id);
                cloneToken.name = user?.name;
                cloneToken.role = user?.role;
            }
            return cloneToken;
        },

        session({ session,token }) {
            const clonedSession = session;
            if(clonedSession.user){
                clonedSession.user.id = toStringSafe(token.id);
                clonedSession.user.name = token.name;
                clonedSession.user.role = token.role;
            }

            return clonedSession;
        }
    }
});