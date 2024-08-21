import { ApiHandler } from 'sst/node/api'

type imdb_items = {
    type: 'Movie' | 'TVSeries',
    name: string,
    url: string,
    image: string,
    description: string,
    alternateName: string,
    aggregateRating: {
        ratingValue: number,
        bestRating: number,
        worstRating: number,
        ratingCount: number
    },
    genre: string,
    contentRating: string,
}

type imdb_meta = {
    name: string,
    description: string,
}

export async function fetchAndExtractScripts(url: string) {
    const request = await fetch("https://www.imdb.com/list/" + url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
        }
    });
    if (!request.ok) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Failed to fetch URL',
            }),
        };
    }
    const htmlContent: string = await request.clone().text();
    const specificScriptRegex = /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gm;

    let scripts: string[] = [];
    let match: any
    let regex = new RegExp(specificScriptRegex);

    if ((match = regex.exec(htmlContent)) !== null) {
        let scriptcontent: string = match[1]

        if (scriptcontent.startsWith('"')) {
            scriptcontent = scriptcontent.slice(1, - 1);
        }

        if (scriptcontent.endsWith('"')) {
            scriptcontent = scriptcontent.slice(0, - 1);
        }

        let json = JSON.parse(scriptcontent);
        let meta: imdb_meta = {
            name: json.name,
            description: json.description
        }
        let items: imdb_items[] = json.itemListElement.map((item: any) => {
            return {
                type: item.item['@type'],
                name: item.item.name,
                url: item.item.url,
                image: item.item.image,
                description: item.item.description,
                alternateName: item.item.alternateName,
                aggregateRating: {
                    ratingValue: item.item.aggregateRating.ratingValue,
                    bestRating: item.item.aggregateRating.bestRating,
                    worstRating: item.item.aggregateRating.worstRating,
                    ratingCount: item.item.aggregateRating.ratingCount
                },
                genre: item.item.genre,
                contentRating: item.item.contentRating
            }
        });
        let output = {
            meta: meta,
            items: items
        }
        return output;
    }
}

export const handler = ApiHandler(async (_evt) => {
    const url = _evt.queryStringParameters.url;
    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Missing url Parameter',
            }),
        };
    }
    if (url.search('ls') === -1) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Invalid URL. Must be a valid IMDb list ID. e.g. ls123456789. Nothing more, nothing less.',
            }),
        };
    }
    const request = await fetchAndExtractScripts(url);

    return {
        statusCode: 200,
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json',
        }
    };
})
