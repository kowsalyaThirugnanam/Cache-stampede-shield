# cache-stampede-shield

A lightweight request-collapsing mechanism to prevent cache stampedes and thundering herd problems in Node.js.

> Note: This package has been renamed to `cache-stampede-shield`. The `node-cache-shield` package is deprecated — please install the new package instead.

## Install

Install the renamed package (recommended):

```bash
npm install cache-stampede-shield
```

If you must continue using the old package (deprecated):

```bash
npm install node-cache-shield
```

## Usage

Using the new package name:

```ts
import { NodeCacheShield } from 'cache-stampede-shield';

const shield = new NodeCacheShield(redisClient);

const result = await shield.fetch('dashboard_metrics', async () => {
  return fetchDatabaseMetrics();
}, 60);
```

Or using the legacy package name (behavior is the same):

```ts
import { NodeCacheShield } from 'node-cache-shield';

// same usage as above
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

## License

MIT
