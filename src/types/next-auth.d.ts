import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
	interface JWT {
		id: UserId;

		access_token?: string | null;
		refresh_token?: string | null;
		expire_at?: number | null;
	}
}

declare module "next-auth" {
	interface Session {
		user: User & {
			id: UserId;
			username?: string | null;
			name?: string | null;
			image?: string | null;
			mobile: string,
			role: string,
			created_at: string,
			merchant: object,
		};
	}
}