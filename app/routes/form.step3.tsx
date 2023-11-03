import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "../form-session";
import invariant from "tiny-invariant";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));
	const p1 = session.get("p1");
	const p2 = session.get("p2");
	const p3 = session.get("p3");
	const code = session.get("code");
	const name = session.get("name");
	const surname = session.get("surname");

	invariant(p1, "missing p1");
	invariant(p2, "missing p2");
	invariant(p3, "missing p3");
	invariant(name, "missing name");
	invariant(surname, "missing surname");

	return {
		p1,
		p2,
		p3,
		code,
		name,
		surname,
	};
};

export default function Component() {
	const data = useLoaderData<typeof loader>();
	return (
		<div>
			<h2>Step 3</h2>
			<pre>{JSON.stringify(data, null, 2)}</pre>
			<p>
				back to <Link to="/form/step1">step 1</Link> or{" "}
				<Link to="/form/step2">step 2</Link>
			</p>
		</div>
	);
}
