import * as http from 'http';
import * as https from 'https';

export class HttpHelper {
    public static get = function (url) {
        // return new pending promise
        return new Promise((resolve, reject) => {
            // select http or https module, depending on reqested url
            const get = url.startsWith('https') ? https.get : http.get;
            const request = get(url, (response) => {
                // handle http errors
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }
                response.setEncoding('utf8');
                let rawData = '';
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        resolve(parsedData)
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            });
            // handle connection errors of the request
            request.on('error', (err) => reject(err))
        });
    }
}
