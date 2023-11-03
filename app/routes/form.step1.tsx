import {
	Form,
	useActionData,
	useFetcher,
	useLoaderData,
} from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { commitSession, getSession } from "../form-session";
import React from "react";
import type { action as discountAction } from "./form.get-discount";

const actionSchema = z.object({
	p1: z.string(),
	p2: z.string(),
	p3: z.string(),
	code: z.string().optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
	const data = Object.fromEntries(await request.formData());
	const result = actionSchema.safeParse(data);
	if (!result.success) {
		return {
			errors: result.error.flatten(),
		};
	}
	const session = await getSession(request.headers.get("Cookie"));
	session.set("p1", result.data.p1);
	session.set("p2", result.data.p2);
	session.set("p3", result.data.p3);
	if (result.data.code) {
		session.set("code", result.data.code);
	}
	return redirect("/form/step2", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));

	return {
		p1: session.get("p1"),
		p2: session.get("p2"),
		p3: session.get("p3"),
		code: session.get("code"),
	};
};

export default function Component() {
	const data = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const fetcher = useFetcher<typeof discountAction>();
	const formRef = React.useRef<HTMLFormElement>(null);

	React.useEffect(() => {
		const fn = () => {
			fetcher.submit(formRef.current, {
				action: "/form/get-discount",
				method: "post",
			});
		};
		const current = formRef.current;
		if (current) {
			current.addEventListener("input", fn);
		}

		return () => {
			if (current) {
				current.addEventListener("input", fn);
			}
		};
	}, [fetcher]);

	const errors =
		actionData && "errors" in actionData ? actionData.errors.fieldErrors : {};
	return (
		<div>
			<h2>step1</h2>
			<Form action="/form/step1" method="post" ref={formRef}>
				<Item
					name="p1"
					values={["1", "2", "3"]}
					errors={errors.p1}
					defaultValue={data.p1}
				/>
				<Item
					name="p2"
					values={["1", "2", "3"]}
					errors={errors.p2}
					defaultValue={data.p2}
				/>
				<Item
					name="p3"
					values={["1", "2", "3"]}
					errors={errors.p3}
					defaultValue={data.p3}
				/>
				<p>
					<input type="text" name="code" defaultValue={data.code} />
					<button
						onClick={(event) => {
							event.preventDefault();
							fetcher.submit(formRef.current, {
								action: "/form/get-discount",
								method: "post",
							});
						}}
					>
						check
					</button>
				</p>
				{fetcher.state === "submitting" && <span>...</span>}
				{fetcher.data?.discount && <div>discount: {fetcher.data.discount}</div>}
				<p>
					<button type="submit">go</button>
				</p>
			</Form>
		</div>
	);
}

type ItemProps = {
	name: string;
	values: string[];
	defaultValue?: string;
	errors?: string[];
};

function Item({ name, values, defaultValue, errors }: ItemProps) {
	return (
		<div>
			{name}:
			{values.map((value) => {
				return (
					<span key={value}>
						<input
							type="radio"
							defaultChecked={value === defaultValue}
							name={name}
							value={value}
						/>
						{value}
					</span>
				);
			})}
			{errors?.map((error) => {
				return <p key={error}>{error}</p>;
			})}
		</div>
	);
}
