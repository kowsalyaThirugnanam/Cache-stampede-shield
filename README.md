# node-cache-shield

A small TypeScript cache shield for Redis and in-process request deduplication.

## Install

```bash
npm install node-cache-shield
```

## Usage

```ts
import { NodeCacheShield } from 'node-cache-shield';

const shield = new NodeCacheShield(redisClient);

const result = await shield.fetch('dashboard_metrics', async () => {
  return fetchDatabaseMetrics();
}, 60);
```

## API

- `fetch(key, fallback, ttlSeconds)`
  - reads from Redis if configured
  - deduplicates concurrent requests in-process
  - saves successful responses back to Redis

## Build

```bash
npm run build
```

## Start

```bash
npm run start
```

## Debug

```bash
npm run debug
```
