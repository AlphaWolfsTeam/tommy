import * as redis from 'redis';
import { promisify } from 'util';
import axios from 'axios';
import { config } from '../config'
import express from 'express';
import { AccessTokenProvider } from '../access-token/access-token-service';
import { logger } from '../utils/logger-client';

export default class MetadataCache {

    private static client: redis.RedisClient = redis.createClient(config.redis.host);
    private static getRedis = promisify(MetadataCache.client.get).bind(MetadataCache.client);
    private static setRedis = promisify(MetadataCache.client.setex).bind(MetadataCache.client);

    public static async metadataHttpCacheMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {

        if (!config.lehava_api.requestTypesToCache.includes(MetadataCache.lehavaReqTypeParse(req.originalUrl))) {
            next();
            return;
        }

        const redisCachedResponse = JSON.parse(await MetadataCache.getRedis(req.originalUrl));

        if (redisCachedResponse) {
            res.send(redisCachedResponse);
            return;
        } else {
            next();
            await MetadataCache.cacheReqToRedis(req)
        }

    }

    private static async cacheReqToRedis(req: express.Request) {
        const headers = { ...req.headers };
        headers["X-AccessKey"] = await AccessTokenProvider.getAccessToken();
        await axios(`http://${config.lehava_api.fullHost}${req.originalUrl.split('/api')[1]}`,
            {
                headers: headers,
                method: "GET"
            }).then(async (res: any) => {
                await MetadataCache.setRedis(req.originalUrl, config.redis.cachedReqsTTL, JSON.stringify(res.data));
                console.log(`Saved ${MetadataCache.lehavaReqTypeParse(req.originalUrl)} request to REDIS cache`);
            }).catch(error => {
                logger(error)
            });
        return;
    }

    private static lehavaReqTypeParse(url: string) {
        return url.substring(
            url.lastIndexOf("/") + 1,
            url.lastIndexOf("?")
        );
    }

}

