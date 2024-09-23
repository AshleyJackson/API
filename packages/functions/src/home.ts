import { ApiHandler } from "sst/node/api";

const availableRoutes = {
    'GET /': "Here",
    'GET /imdb/list/{list_id}': 'Provide a URL to an IMDb list. Note TTL is 7 days.',
    'GET /imdb/title/{title_id}': 'Provide a URL to an IMDb title. Note TTL is 7 days.',
    'GET /email/validate/{email}': 'Provide an email address to validate.',
		'GET /domain/lookup/{domain}': 'Provide a domain to lookup.',
}

const notes = {
    'api': {
        '/imdb/list/{list_id}': 'This is currently limited to 100 items.',
        '/imdb/title/{title_id}': 'N/A',
        '/email/validate/{email}': 'N/A',
				'/domain/lookup/{domain}': 'N/A',

    },
    'SourceCode': 'https://github.com/ashleyjackson/API',
}

export const handler = ApiHandler(async (_evt) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            routes: availableRoutes,
            notes: notes,
        }),
    }
});
