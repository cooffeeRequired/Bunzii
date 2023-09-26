Bun: 1.0.3

Tested at: 10:13, September 26th, 2023

## OS Details
- Cores: 12
- Model: AMD Ryzen 5 3600X 6-Core Processor
- OS: Linux
- System memory: 11.6GB
- Architecture: x64
## Tests
### GET `/`
Should return `Hi` as a response.
### GET `/api/hi`
Should return `Welcome` as a response.
### GET `/id/53?name=FUd`
Should return the `id` parameter value and the query value, for example `1 a` when the request path is `/id/1?name=a`.
### GET `/a/b`
Should return a response with `404` status code.
### POST `/api/json`
Return the request body with `Content-Type` set to `application/json`.
### Info
- Connections: 500
- Duration: 20s
- Using `fasthttp`: `true`
- Results are measured in requests per second.

## Results
| Name | Average | GET `/` | GET `/api/hi` | GET `/id/12?name=zTC` | GET `/a/b` | POST `/api/json` |
|  :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [Bunzii](/results/main/) | 58747.29 | 62502.38 | 64596.03 | 58429.26 | 59007.95 | 49200.84 |