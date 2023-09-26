import { Server, file } from "bun"
import Handlebars from "handlebars";
const QS = require('fast-querystring')
import * as J from 'fp-ts/Json'

type BunziParams = {
    [key: string]: {}
}

type BunziContent = {
    [key: string]: {}
} | string | Blob | ArrayBuffer | FormData | ReadableStream<Uint8Array> | null | undefined

interface BunzRequest extends Request {
    params: BunziParams,
    content: BunziContent | any,
    query: any;
}

type BunzEngineRoute = {
    method: string,
    path: string,
    handler: Function,
    params: BunziParams
} | null // Ahha!

type BunzEngineRoutes = {
    [key: string]: BunzEngineRoute
}

type BunziResponseStatuses = {
    [key: string]: {
        short: string,
        long: string
    }
}

class BunziResponse {
    private statusCode: number = 201;
    private headers: Headers;
    private engine: string;

    constructor(options: { headers: Headers, template_engine: string }) {
        this.headers = options.headers;
        this.engine = options.template_engine;
    }

    public send(str: any): Response {
        return new Response(str, { status: this.statusCode, headers: this.headers })
    }

    public json(obj: any): Response | Error {
        try {
            this.headers.set('Content-Type', 'application/json');
            this.headers.set('Content-Type-X', 'application/json+bunzi')
            return Response.json(obj, { status: this.statusCode, headers: this.headers })
        } catch (e: any) {
            return new Error(e.toString())
        }
    }

    public sendFile(path: string): Response | Error {
        try {
            return new Response(file(path), { status: this.statusCode, headers: this.headers })
        } catch (e: any) {
            return new Error(e.toString())
        }
    }

    public render(data: any, input: any): Response | Error {
        try {
            switch (this.engine.toLocaleLowerCase()) {
                case "static-html": {
                    return new Response(data);
                }
                case "handlebars": {
                    const template = Handlebars.compile(data);
                    const html = template(input);
                    return new Response(html, { status: this.statusCode, headers: this.headers })
                }
                default:
                    return new Response(data);
            }
        } catch (e: any) {
            return new Error(e.toString())
        }
    }

    public status(code: number) {
        this.statusCode = code;
        return this;
    }
}


class Bunzii {
    public static statuses: BunziResponseStatuses = {};

    server: Server | undefined
    routes: BunzEngineRoutes = {}
    headers: Headers = new Headers();
    engine: string = "static-html"

    constructor() {
        try {
            // * Set default headers for Bunzi
            this.headers.set('X-Powered-By', 'Bunzi')
            this.headers.set('Server', 'BunziServe')
            this.headers.set('Content-Type', 'text/html')
        } catch (e: any) {
            console.error(e.toString())
        }
    }
    //! check it.
    private findRoute(path: string): Promise<BunzEngineRoute | null> {
        return new Promise((resolve) => {
            const splitPath = path.split("/").filter(Boolean);
            const routes = Object.keys(this.routes);

            for (const route of routes) {
                const routeSplit = route.split("/").filter(Boolean);

                if (splitPath.length !== routeSplit.length) {
                    continue;
                }

                const params: BunziParams = {};
                const isMatch = routeSplit.every((routePart, i) => {
                    const urlPart = splitPath[i];

                    if (routePart.startsWith(":")) {
                        const paramName = routePart.slice(1); // Remove ':'
                        params[paramName] = urlPart;
                        return true; // Continue checking
                    } else if (routePart !== urlPart) {
                        return false; // Exit early if parts don't match
                    }

                    return true; // Continue checking
                });

                if (isMatch) {
                    const matchingRoute = this.routes[route];

                    if (matchingRoute) {
                        matchingRoute.params = params;
                        return resolve(matchingRoute);
                    }
                }
            }

            resolve(null); // Default to 404 if no matching route is found
        });
    }

    public setEngine(name: string) {
        this.engine = name;
    }

    public route(method: string, path: string, handler: Function) {
        this.routes[path] = {
            method,
            path,
            handler,
            params: {}
        }
    }

    public get(path: string, handler: Function) {
        this.route('GET', path, handler)
    }

    public post(path: string, handler: Function) {
        this.route('POST', path, handler)
    }

    public put(path: string, handler: Function) {
        this.route('PUT', path, handler)
    }

    public patch(path: string, handler: Function) {
        this.route('PATCH', path, handler)
    }

    public delete(path: string, handler: Function) {
        this.route('DELETE', path, handler)
    }

    public listen(port: number) {
        this.server = Bun.serve({
            port,
            fetch: async (request: BunzRequest) => {
                const requestURL = new URL(request.url);
                const requestPath = requestURL.pathname;
                // Check if the route is cached
                //let route = this.routes[requestPath];
                const route = this.routes[requestPath] || await this.findRoute(requestPath);

                if (!route) return new Response('Not Found', { status: 404, headers: this.headers });

                if (route && route.method === request.method) {
                    request = request;
                    request.params = route.params;
                    request.query = QS.parse(request.url.split('?')[1])
                    const response = route.handler(request, new BunziResponse({ headers: this.headers, template_engine: this.engine }));
                    return response;
                }

                // if (!route) {
                //     // If not cached, find the route and cache it
                //     route = await this.findRoute(requestPath);
                //     if (route) {
                //         this.routes[requestPath] = route;
                //     }
                // }


                // Use a constant for 404 response
                //return new Response('Not Found', { status: 404, headers: this.headers });
            },
        });
    }

}

export { Bunzii, BunziResponse, BunzRequest }
