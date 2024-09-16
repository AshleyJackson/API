import { ApiHandler } from "sst/node/api";
import { validate } from 'deep-email-validator'

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
			// validateMx: false,
			// validateSMTP: false,
		});
		console.log(`Validation result: ${JSON.stringify(request)}`);
	} catch (error) {
		console.error(`Validation error: ${error}`);
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: 'Invalid email',
			}),
		};
	}

	console.log(`Validation result: ${JSON.stringify(request)}`);
	return {
		statusCode: 200,
		body: JSON.stringify(request),
	};
})
