Bun: 1.0.2

Tested at: 22:12, September 25th, 2023

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
### GET `/id/20?name=mZD`
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
| Name | Average | GET `/` | GET `/api/hi` | GET `/id/35?name=wV3` | GET `/a/b` | POST `/api/json` |
|  :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [Stric 4.2.3](/results/main/Stric) | 88838.30 | 100619.43 | 94235.28 | 87143.29 | 95765.76 | 66427.75 |
| [Vix 0.0.7](/results/main/Vix) | 84641.94 | 91025.44 | 93755.54 | 85692.61 | 89772.15 | 62963.98 |
| [Elysia 0.7.2](/results/main/Elysia) | 74038.59 | 81570.17 | 77156.63 | 73939.48 | 80764.64 | 56762.04 |
| [Hono 3.7.2](/results/main/Hono) | 70221.11 | 89161.70 | 79671.72 | 60593.13 | 65869.58 | 55809.42 |
| [Bunzii](/results/main/) | 62282.56 | 70524.16 | 67772.46 | 57838.67 | 63139.62 | 52137.90 |
| [Grace 0.3.9](/results/main/Grace) | 47962.48 | 55458.27 | 53203.86 | 41386.60 | 52973.82 | 36789.83 |