import { stage, username } from './packages/functions/common/consts'
import * as fs from 'fs'

type deployed_functionality = | {
	name: string,
	tool: "API"
	method: "GET" | "POST"
	endpoint: string,
	handler: string,
	stage: string[]
} | {
	name: string,
	tool: "CRON",
	handler: string,
	stage: string[]
}

export const functions: deployed_functionality[] = [
	{
		name: "home",
		tool: "API",
		method: "GET",
		endpoint: "/",
		handler: "packages/functions/src/home.handler",
		stage: ["API"]
	},
	{
		name: "imdb_list_get",
		tool: "API",
		method: "GET",
		endpoint: "/imdb/list/{id}",
		handler: "packages/functions/src/imdb/list.handler",
		stage: ["API"]
	},
	{
		name: "imdb_title_get",
		tool: "API",
		method: "GET",
		endpoint: "/imdb/title/{id}",
		handler: "packages/functions/src/imdb/title.handler",
		stage: ["API"]
	},
	{
		name: "email_validate_get",
		tool: "API",
		method: "GET",
		endpoint: "/email/validate/{email}",
		handler: "packages/functions/src/email/validate.handler",
		stage: ["API"]
	},
	{
		name: "domain_lookup_get",
		tool: "API",
		method: "GET",
		endpoint: "/domain/lookup/{domain}",
		handler: "packages/functions/src/domain/lookup.handler",
		stage: ["API"]
	}
]

type route = {
	[route: string]: {
		function: {
			handler: string
		}
	}
}

export async function buildRoutes(stage: string) {
	let routes: route[] = []
	for (const func of functions) {
		if (func.stage.includes(stage) || (stage.includes("live") && func.stage.includes("API"))) {
			if (func.tool === "API") {
				routes.push({
					[`${func.method} ${func.endpoint}`]: {
						function: {
							handler: `${func.handler}`
						}
					}
				})
			}
		}
	}
	return routes
}

const template = async (route_name: string, route_string: string, route_handler: string) => `const ${route_name} = {
	"${route_string}": {
		function: {
			handler: "${route_handler}"
	}}
}\n\n`

export async function start() {
	const routes = await buildRoutes(stage)
	fs.writeFileSync("packages/functions/common/routes.ts", "");
	let default_export = `export default {\n}`;
	if (!routes) {
		console.log("No routes found")
		process.exit(1);
	}
	for (const route in routes) {
		const fullrouteString = Object.keys(routes[route])[0];
		const routeString: string = fullrouteString.split(" /")[1].replaceAll("/", "_").replaceAll("{", "").replaceAll("}", "");
		const route_handler = routes[route][fullrouteString].function.handler;
		const route_name = 'route_' + routeString;
		fs.appendFileSync("packages/functions/common/routes.ts", await template(route_name, fullrouteString, route_handler));
		default_export = default_export.replace("}", `...${route_name},\n}`);
	}
	fs.appendFileSync("packages/functions/common/routes.ts", default_export);
	fs.appendFileSync("packages/functions/common/routes.ts", "\n");
}

start()