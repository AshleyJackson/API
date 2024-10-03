import { ApiHandler } from "sst/node/api";
import whoiser from 'whoiser';

export const handler = ApiHandler(async (_evt) => {
	const domain = _evt.pathParameters?.domain;
	if (!domain) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: 'Missing domain',
			}),
		};
	}
	console.log(`Looking up domain: ${domain}`);
	const lookup = await whoiser(domain, {
		ignorePrivacy: true,
		follow: 1,
	});
	return {
		statusCode: 200,
		body: JSON.stringify(lookup),
	};
});
