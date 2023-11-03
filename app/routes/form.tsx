import { Link, Outlet } from "@remix-run/react";

export default function Component() {
	return (
		<div>
			<h1>Form</h1>
			<div>
				<Link to="/form/step1">step1</Link> or{" "}
				<Link to="/form/step2">step2</Link>
			</div>
			<Outlet />
		</div>
	);
}
