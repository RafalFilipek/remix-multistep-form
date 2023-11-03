import type { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";

const actionSchema = z.object({
	p1: z.string(),
	p2: z.string(),
	p3: z.string(),
	code: z.enum(["ten", "dziala"]).optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = Object.fromEntries(await request.formData());
	const result = actionSchema.safeParse(data);
	if (!result.success) {
		return { discount: false };
	}

	await new Promise((r) => {
		setTimeout(r, 1000);
	});

	return {
		discount:
			(Number.parseInt(result.data.p1, 10) +
				Number.parseInt(result.data.p2, 10) +
				Number.parseInt(result.data.p3, 10)) *
			0.8,
	};
};
