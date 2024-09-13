import { ApiHandler } from "sst/node/api";
import { validate } from 'deep-email-validator'

type output = {
	valid: boolean,
	validators: {
		regex: {
			valid: boolean,
		},
		typo: {
			valid: boolean,
		},
		disposable: {
			valid: boolean,
		},
		mx: {
			valid: boolean,
			note: string,
		},
		smtp: {
			valid: boolean,
			note: string,
		},
	}
}

export const handler = ApiHandler(async (_evt) => {
	let output: output
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
	const request = await validate({
		email: email,
		validateMx: false, // Note: Disabled for now, as it requires the function to have internet access
		validateSMTP: false, // Note: Disabled for now, as it requires the function to have internet access
	});

	console.log(`Validation result: ${JSON.stringify(request)}`);
	return {
		statusCode: 200,
		body: request,
	};
})
