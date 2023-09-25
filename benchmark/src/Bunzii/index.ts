import { Bunzii, BunziRequest, TBunziRequest } from "../../../index.ts";

var bunzii = new Bunzii();
bunzii.get('/', (req: TBunziRequest, res: BunziRequest) => {
    return res.status(200).send('Hi');
})

bunzii.get('/id/:id', (req: TBunziRequest, res: BunziRequest) => {
    return res.status(200).send(req.params.id + ' ' + req.query.get('name'));
})

bunzii.get('/api/hi', (req: TBunziRequest, res: BunziRequest) => {
    return res.status(200).send('Welcome');
})

bunzii.post('/api/json', (req: TBunziRequest, res: BunziRequest) => {
    return res.status(200).json(req.requestBody);
})

bunzii.listen(3000)

