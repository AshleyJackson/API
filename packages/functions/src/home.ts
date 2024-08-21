import { ApiHandler } from "sst/node/api";

const availableRoutes = {
    'GET /': "Here",
    'GET /imdb?url={url}': 'Provide a URL to an IMDb list. Note TTL is 7 days.',
}

const notes = {
    'api': {
        'imdb?url={url}': 'This is currently limited to 100 items.',
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
