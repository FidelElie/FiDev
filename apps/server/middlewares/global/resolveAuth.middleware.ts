import { getCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { JwtTokenExpired } from "hono/utils/jwt/types";

import { eq, SessionModel, UserModel } from "@fi/database";

import { Middleware } from "@/configs";

import { DatabaseHelpers } from "@/libraries/utilities";

export const resolveAuthMiddleware = Middleware(
	async (context, next) => {
		const { Database } = context.var;
		const { AUTH_SECRET } = context.env;

		const setNullAuthContext = async () => {
			context.set("User", null);
			context.set("Session", null);
			await next();
		};

		const authorisationHeader = context.req.header("Authorization");

		if (!authorisationHeader) {
			await setNullAuthContext();
			return;
		}

		const { token, access } = await (async () => {
			try {
				const decodedToken = await verify(
					authorisationHeader.replace("Bearer ", ""),
					AUTH_SECRET,
				) as { sessionId: string } | null;

				return { token: decodedToken, access: null };
			} catch (error) {
				if (error instanceof JwtTokenExpired) {
					console.log("Handling access token refresh");

					const refreshToken = getCookie(context, "AUTH_SESSION_REFRESH");

					if (!refreshToken) {
						return { token: null, access: null };
					}

					const correspondingSession = DatabaseHelpers.getFirst(
						await Database.select().from(SessionModel).where(
							eq(SessionModel.token, refreshToken),
						),
					);

					if (!correspondingSession) {
						return { token: null, access: null };
					}

					const accessToken = await sign({
						sessionId: correspondingSession.id,
						userId: correspondingSession.userId,
						exp: Date.now() + (5 * 60 * 1000),
					}, AUTH_SECRET);

					return { token: { sessionId: correspondingSession.id }, access: accessToken };
				}

				console.error(error);

				return { token: null, access: null };
			}
		})();

		if (!token) {
			await setNullAuthContext();
			return;
		}

		if (access) { context.header("X-Token-Refresh", access); }

		context.set("SessionID", token.sessionId);

		const sessionInformation = DatabaseHelpers.getFirst(
			await Database
				.select()
				.from(SessionModel)
				.fullJoin(UserModel, eq(SessionModel.userId, UserModel.id))
				.where(eq(SessionModel.id, token.sessionId))
				.limit(1),
		);

		if (!sessionInformation?.sessions || !sessionInformation.users) {
			await setNullAuthContext();
			return;
		}

		context.set("Session", sessionInformation.sessions);
		context.set("User", sessionInformation.users);

		await next();
	},
);
