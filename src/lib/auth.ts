import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import "dotenv/config";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import SallaProvider from "./salla";
export const authOptions: NextAuthOptions = {
	// @ts-ignore
	adapter: DrizzleAdapter(db),
	secret: process.env.NEXTAUTH_SECRET!,
	providers: [
		SallaProvider({
			clientId: process.env.AUTH_CLIENT_ID!,
			clientSecret: process.env.AUTH_CLIENT_SECRET!,

		})

	],
	basePath: "/api/auth",
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async session({ session, token, user }) {
			console.log('in session', session);
			console.log('in session token', token);
			console.log('in session user', user);
			// do something to session
			if (token) {
				session.user.id = token.id;
				//session.user.username = token.username;
				session.user.email = token.email;
				session.user.name = token.name;
				//session.user.image = token.image as string;
			}
			return session;
		},
		async jwt({ token, user, account }) {
			const email = token.email;
			console.log('in jwt callback', account);
			const dbUser = (
				await db
					.select()
					.from(users)
					.where(eq(users.email, email as string))
			)[0];

			if (!dbUser) {
				token.id = user.id;
				return token;
			}
			if (!dbUser.name) {
				await db
					.update(users)
					.set({ name: nanoid(10) })
					.where(eq(users.id, dbUser.id));
			}

			return {
				id: dbUser.id,
				// access_token: account?.access_token,
				// expire_at: account?.expires_at,
			};
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
