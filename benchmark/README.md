# Benchmark
Benchmarking Bun, Node and Deno [frameworks](/src) performance, in requests per second.

You can see the details results [here](/results/index.md). 

I recommend testing this by yourself as performance may varies on different machine.

## Requirements
All tool required to set up and run the benchmark.

### Bun
Bun is required to run Bun frameworks and benchmark scripts. See [bun.sh](https://bun.sh).

### Bombardier
Go is required to install the `bombardier` CLI. See [go.dev](https://go.dev).
Install `bombardier` using:
```bash
# Install the CLI without a `go.mod` file
go install -mod=mod github.com/codesenberg/bombardier

# Check after install
bombardier --version
```
You need to manually set `GO_PATH` to your extracted `go` directory, `GO_BIN` to `$GO_PATH/bin` and add `GO_BIN` to `PATH` if `bombardier --version` fails.

## Start
Clone this reposity. Go to the root directory and run:
```bash
# Install required dependencies
bun ins

# Run the benchmark
bun bench

# Or do both
bun start
```

## Configurations
See [configuration file](/config.ts) and the [type declarations](/lib/types.ts). 

## Results

### Chart
![Chart](/results/chart.png)

### Table 


| Name | Average | GET `/` | GET `/api/hi` | GET `/id/35?name=wV3` | GET `/a/b` | POST `/api/json` |
|  :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [Stric 4.2.3](/results/main/Stric) | 88838.30 | 100619.43 | 94235.28 | 87143.29 | 95765.76 | 66427.75 |
| [Vix 0.0.7](/results/main/Vix) | 84641.94 | 91025.44 | 93755.54 | 85692.61 | 89772.15 | 62963.98 |
| [Elysia 0.7.2](/results/main/Elysia) | 74038.59 | 81570.17 | 77156.63 | 73939.48 | 80764.64 | 56762.04 |
| [Hono 3.7.2](/results/main/Hono) | 70221.11 | 89161.70 | 79671.72 | 60593.13 | 65869.58 | 55809.42 |
| [Bunzii](/results/main/) | 62282.56 | 70524.16 | 67772.46 | 57838.67 | 63139.62 | 52137.90 |
| [Grace 0.3.9](/results/main/Grace) | 47962.48 | 55458.27 | 53203.86 | 41386.60 | 52973.82 | 36789.83 |