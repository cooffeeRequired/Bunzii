import bunzii from './bunzi/Bunzii.ts';
import { BunzRequest } from './bunzi/types.ts'
import { BunziResponse } from './bunzi/BunziResponse.ts'

bunzii
    .setEngine('handlebars')
    .get('/', (_: BunzRequest, res: BunziResponse) => res.status(200).send('Hi'))
    .get('/id/:id', (req: BunzRequest, res: BunziResponse) => res.status(200).send(req.params.id + ' ' + req.query.name))
    .get('/api/hi', (_: BunzRequest, res: BunziResponse) => res.status(200).send('Welcome'))
    .post('/api/json', async (req: BunzRequest, res: BunziResponse) => res.status(200).json(await req.json()))
    .get('/home', (_: BunzRequest, res: BunziResponse) => {
        try {
            return res.status(200).render('@home', { name: 'Bunzi' })
        } catch (e) {
            return res.status(500).send(e)
        }
    })
    .listen(3000)