import {
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
	redirect,
} from "@remix-run/node";
import { commitSession, getSession } from "../form-session";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";

const actionSchema = z.object({
	name: z.string().min(1),
	surname: z.string().min(1),
});

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = Object.fromEntries(await request.formData());
	const result = actionSchema.safeParse(data);
	console.log(result);
	if (!result.success) {
		return {
			errors: result.error.flatten(),
		};
	}
	const session = await getSession(request.headers.get("Cookie"));
	session.set("name", result.data.name);
	session.set("surname", result.data.surname);
	return redirect("/form/step3", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));

	const name = session.get("name");
	const surname = session.get("surname");

	return {
		name,
		surname,
	};
};

export default function Component() {
	const actionData = useActionData<typeof action>();
	const errors =
		actionData && "errors" in actionData ? actionData.errors.fieldErrors : {};
	const data = useLoaderData<typeof loader>();
	return (
		<div>
			<h2>step 2</h2>
			<Form action="/form/step2" method="post">
				<div>
					<input
						type="text"
						name="name"
						placeholder="name"
						defaultValue={data.name}
					/>
					{errors?.name?.map((error) => {
						return <p key={error}>{error}</p>;
					})}
				</div>
				<p>
					<input
						type="text"
						name="surname"
						placeholder="surname"
						defaultValue={data.surname}
					/>
					{errors?.surname?.map((error) => {
						return <p key={error}>{error}</p>;
					})}
				</p>
				<p>
					<button type="submit">go</button>
				</p>
			</Form>
			<p>
				<Link to="/form/step1">back</Link>
			</p>
		</div>
	);
}
