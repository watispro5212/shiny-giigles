const logger = require('./logger');

class CacheManager {
    constructor() {
        this.cache = new Map();
        // Default TTL of 5 minutes
        this.defaultTTL = 5 * 60 * 1000;
    }

    /**
     * Get an item from the cache
     * @param {string} key 
     * @returns {any|null}
     */
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        // Check if expired
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    /**
     * Set an item in the cache
     * @param {string} key 
     * @param {any} value 
     * @param {number} ttl Time to live in milliseconds 
     */
    set(key, value, ttl = this.defaultTTL) {
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttl
        });
    }

    /**
     * Remove an item from the cache
     * @param {string} key 
     */
    invalidate(key) {
        this.cache.delete(key);
    }

    /**
     * Clear all expired items (can be run on an interval)
     */
    sweep() {
        let swept = 0;
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
                swept++;
            }
        }
        if (swept > 0) {
            logger.info(`[CacheManager] Swept ${swept} expired items.`);
        }
    }
}

module.exports = new CacheManager();
