import { Bunzii, BunzRequest, BunziResponse } from "../../../index.ts";

var bunzii = new Bunzii();
bunzii.route('GET', '/', (req: BunzRequest, res: BunziResponse) => {
    return res.send('Hi')
})
// bunzii.get('/', (req: BunzRequest, res: BunziResponse) => {
//     return res.status(200).send('Hi');
// })

bunzii.get('/id/:id', (req: BunzRequest, res: BunziResponse) => {
    return res.status(200).send(`${req.params.id} ${req.query.name}`);
})

bunzii.get('/api/hi', (req: BunzRequest, res: BunziResponse) => {
    return res.status(200).send('Welcome');
})

bunzii.post('/api/json', async (req: BunzRequest, res: BunziResponse) => {
    return res.status(200).json(await req.json());
    // the .json() method is so slow. we need to figure out what we use instaead of.
    //*Good night m8! night!
})

bunzii.listen(3000)

