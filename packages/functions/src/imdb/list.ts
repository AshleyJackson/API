import { ApiHandler } from 'sst/node/api'

type imdb_items = {
    type: 'Movie' | 'TVSeries',
    name: string,
    url: string,
    image: string,
    description: string,
    alternateName: string,
    aggregateRating?: {
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

export async function fetchAndExtractScripts(list_id: string) {
    console.log(`Fetching list: ${list_id}`);
    const url = "https://www.imdb.com/list/" + list_id;
    if (list_id.startsWith("ls") === false) return {
        statusCode: 400,
        body: JSON.stringify({
            error: 'Invalid list_id',
        }),
    }
    const request = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
        }
    });
    if (!request.ok) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: request.statusText,
            }),
        };
    }
    const htmlContent: string = await request.clone().text();
    const specificScriptRegex = /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gm;

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
    const list_id = _evt.pathParameters?.id;
    if (!list_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Missing list_id',
            }),
        };
    }
    const request = await fetchAndExtractScripts(list_id);

    return {
        statusCode: 200,
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json',
        }
    };
})
