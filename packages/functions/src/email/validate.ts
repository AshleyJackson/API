import { ApiHandler } from "sst/node/api";
import { validate } from '@ashleyjackson-org/email-validator';

export const handler = ApiHandler(async (_evt) => {
	const email = _evt.pathParameters?.email;
	if (!email) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: 'Missing email',
			}),
		};
	}

	console.log(`Validating email: ${email}`);
	let request
	try {
		request = await validate({
			email: email,
			port: 587,
		});
	} catch (error) {
		console.error(`Validation error: ${error}`);
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: 'Invalid email',
			}),
		};
	}

	return {
		statusCode: 200,
		body: JSON.stringify(request),
	};
})
