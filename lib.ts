import type { RedisClientType } from 'redis';

export class NodeCacheShield {
    private readonly pendingRequests = new Map<string, Promise<unknown>>();
    private readonly redisClient: RedisClientType | null;

    constructor(redisClient?: RedisClientType | null) {
        this.redisClient = redisClient ?? null;
    }

    async fetch<T>(
        key: string,
        fallback: () => Promise<T>,
        ttlSeconds: number = 5
    ): Promise<T> {

        // 1. Check Redis shared cache if it exists
        if (this.redisClient) {
            try {
                const cachedData = await this.redisClient.get(key);
                if (cachedData) {
                    console.log(`[Shield] Redis Cache HIT for key: "${key}"`);
                    return JSON.parse(cachedData) as T;
                }
            } catch (err) {
                console.error(`[Shield] Redis read error:`, err);
            }
        }

        const pendingPromise = this.pendingRequests.get(key);
        if (pendingPromise) {
            console.log(`[Shield] Cache MISS for key: "${key}" | Attaching to active Promise.`);
            return pendingPromise as Promise<T>;
        }

        // 3. First request hits the actual Database/API source
        console.log(`[Shield] Cache MISS for key: "${key}" | Initiating FRESH database fetch.`);

        const promise = fallback()
            .then(async (data) => {
                if (this.redisClient) {
                    try {
                        await this.redisClient.set(key, JSON.stringify(data), {
                            EX: ttlSeconds
                        });
                    } catch (redisSetErr) {
                        console.error(`[Shield] Failed to save to Redis:`, redisSetErr);
                    }
                }
                return data;
            })
            .catch((error) => {
                console.error(`[Shield] Fallback execution failed for key: "${key}".`);
                throw error;
            })
            .finally(() => {
                this.pendingRequests.delete(key);
            });

        this.pendingRequests.set(key, promise);
        return promise;
    }
}