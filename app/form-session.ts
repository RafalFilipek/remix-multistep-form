import { createCookieSessionStorage } from "@remix-run/node";

export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage<{
		p1: string;
		p2: string;
		p3: string;
		code: string;
		name: string;
		surname: string;
	}>({
		// a Cookie from `createCookie` or the same CookieOptions to create one
		cookie: {
			name: "__form",
			secrets: ["r3m1xr0ck5"],
			sameSite: "lax",
		},
	});
