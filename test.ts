import { Bunzii, BunzRequest, BunziResponse } from "./index.ts";
console.log('Loading')

var bunzii = new Bunzii();
bunzii.get('/', (_: BunzRequest, res: BunziResponse) => {
    return res.status(200).send('Hi');
})

bunzii.get('/id/:id', (req: BunzRequest, res: BunziResponse) => {
    return res.status(200).send(req.params.id + ' ' + req.query.name);
})

bunzii.get('/api/hi', (_: BunzRequest, res: BunziResponse) => {
    return res.status(200).send('Welcome');
})

bunzii.post('/api/json', async (req: BunzRequest, res: BunziResponse) => {
    return res.status(200).json(await req.json());
})

bunzii.listen(3000)
// console.log(`Running on ${bunzii.}`)