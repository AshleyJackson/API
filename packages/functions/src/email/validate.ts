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

    const { valid, reason, validators } = await validate(email);
    return {
        statusCode: 200,
        body: JSON.stringify({
            email,
            valid,
            reason,
            validators,
        }),
    };
})
