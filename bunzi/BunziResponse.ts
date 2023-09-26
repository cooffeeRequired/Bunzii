import { file, Server } from "bun";
import Handlebars from "handlebars";

export class BunziResponse {
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

    public async render(data: any, input: any): Promise<Response | Error> {
        try {
            switch (this.engine.toLocaleLowerCase()) {
                case "static-html": return new Response(data);
                case "handlebars": {
                    let html;
                    if (data.startsWith('@')) {
                        const _file = file(`./pages/${data.replace('@', '')}.handlebars`)
                        if (await _file.exists()) {
                            Handlebars.registerPartial('body', await file('./pages/body@partial.handlebars').text());
                            Handlebars.registerPartial('header', await file('./pages/header@partial.handlebars').text());
                            Handlebars.registerPartial('footer', await file('./pages/footer@partial.handlebars').text());
                            const template = Handlebars.compile(await _file.text());
                            html = template(input);
                        } else {
                            return new Response(`Template ${data} not found`, { status: 404 })
                        }
                    } else {
                        const template = Handlebars.compile(data);
                        html = template(input);
                    }
                    return new Response(html, { status: this.statusCode, headers: this.headers })
                }
                default:
                    return new Response(`Template ${data} not found`, { status: 404 })
            }
        } catch (e: any) {
            return new Response(`Something goes wrong: \n${e.message}`, { status: 404 })
        }
    }

    public status(code: number) {
        this.statusCode = code;
        return this;
    }
}