import { Server, file } from "bun"
import Handlebars from "handlebars";

type BunziParams = {
    [key: string]: {}
}

type BunziContent = {
    [key: string]: {}
} | string | Blob | ArrayBuffer | FormData | ReadableStream<Uint8Array> | null | undefined

interface BunzRequest extends Request {
    params: BunziParams,
    content: any
}

type BunzEngineRoute = {
    method: string,
    path: string,
    handler: Function,
    params: BunziParams
}

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
    private statusCode: number = 404;
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

    public statusText(text: string) {
        const find = Object.keys(Bunzii.statuses).find((status) => {
            const statusObj = Bunzii.statuses[status];
            return statusObj.short === text;
        });
        if (find) this.statusCode = parseInt(find);
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
            // * Load statuses from File
            // const file = Bun.file('statuses.json');
            // file.json().then((data: BunziResponseStatuses) => {
            //     const filteredObject: BunziResponseStatuses = {};

            //     for (const key in data) {
            //         if (!key.includes("xx")) {
            //             filteredObject[key] = data[key];
            //         }
            //     }
            //     Bunzii.statuses = filteredObject;
            // })

            // * Set default headers for Bunzi
            this.headers.set('X-Powered-By', 'Bunzi')
            this.headers.set('Server', 'BunziServe')
            this.headers.set('Content-Type', 'text/html')
        } catch (e: any) {
            console.error(e.toString())
        }
    }

    private findRoute(path: string) {
        return new Promise<BunzEngineRoute>((resolve, reject) => {

            // Goes through routes and extracts all prams
            let splitPath = path.split("/")
            splitPath.shift()

            Object.keys(this.routes).map((v, i) => {
                let routeSplit = v.split("/")
                routeSplit.shift()

                if (splitPath.length == routeSplit.length) {
                    let difference = splitPath.filter(x => !routeSplit.includes(x));
                    let prams: BunziParams = {}

                    for (let pramNameIndex in routeSplit) {
                        let pramName = routeSplit[pramNameIndex]
                        let thing = pramName.replace(":", "")
                        prams[thing] = difference[pramNameIndex]
                    }
                    let route: BunzEngineRoute = this.routes[v]
                    route.params = prams
                    resolve(route)
                }
            })
        })
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
                let route = this.routes[requestPath];
                request.content = request;
                if (!route) route = await this.findRoute(requestPath)

                if (route && route.method === request.method) {
                    request.params = route.params
                    return route.handler(request, new BunziResponse({ headers: this.headers, template_engine: this.engine }));
                }
                return new Response('404');
            },
        })
    }
}

// ABC

export { Bunzii, BunziResponse, BunzRequest }

const engine = new Bunzii()
engine.setEngine("handlebars")
engine.get('/hello', (req: BunzRequest, res: BunziResponse) => {
    return res.json({ message: 'Hello World!' })
})

engine.get("/:name/abc/:last", (req: BunzRequest, res: BunziResponse) => {
    console.log("ABC")
    return res.status(200).json(req.params ?? {})
    // return res.json({})
})

engine.get("/:name/xyz/:last", (req: BunzRequest, res: BunziResponse) => {
    console.log("XYZ")
    return res.json(req.params ?? {})
    // return res.json({})
})

engine.post('/api/json', async (req: BunzRequest, res: BunziResponse) => {
    return res.status(200).json(await req.content.json());
})

engine.listen(3000)
console.log('Listening on port 3000')