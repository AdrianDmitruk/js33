import { VERSION } from 'service_worker/constants/version'

class CacheService {
  private cache: Cache | null = null

  async open() {
    if (!this.cache) {
      this.cache = await caches.open(VERSION)
    }
    return this.cache
  }

  async clear() {
    const names = await caches.keys()
    for (const name of names) {
      if (name !== VERSION) {
        caches.delete(name)
      }
    }
  }
}

export const cacheService = new CacheService()
