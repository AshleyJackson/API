import { ApiHandler } from "sst/node/api";

type Title = {
    name: string,
    type: 'TVSeries' | 'Movie',
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
    genre: string[],
    contentRating: string,

}

export async function fetchAndExtractScripts(title_id: string) {
    console.log("Fetching Title: ", title_id);
    const url = "https://www.imdb.com/title/" + title_id + "/";
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
    const titleRegex = /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gm;

    let match: any
    let regex = new RegExp(titleRegex);

    if ((match = regex.exec(htmlContent)) !== null) {
        let scriptcontent: string = match[1]

        if (scriptcontent.startsWith('"')) {
            scriptcontent = scriptcontent.slice(1, - 1);
        }

        if (scriptcontent.endsWith('"')) {
            scriptcontent = scriptcontent.slice(0, - 1);
        }

        let json = JSON.parse(scriptcontent);
        return json
    }
}


export const handler = ApiHandler(async (_evt) => {
    const title_id = _evt.pathParameters?.id;
    if (!title_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Missing title_id',
            }),
        };
    }
    const request = await fetchAndExtractScripts(title_id);
    // console.log(request);

    const data: Title = {
        name: request.name,
        type: request['@type'],
        description: request.description,
        url: request.url,
        image: request.image,
        alternateName: request.alternateName,
        aggregateRating: request.aggregateRating,
        genre: request.genre,
        contentRating: request.contentRating,
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }

});