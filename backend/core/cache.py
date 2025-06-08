"""
Enhanced caching system with Redis backend and intelligent caching strategies
"""

import json
import pickle
import asyncio
import logging
from typing import Any, Optional, Dict, List, Union
from datetime import datetime, timedelta
import redis.asyncio as redis
from redis.asyncio import ConnectionPool

from core.config import settings

logger = logging.getLogger(__name__)

class CacheManager:
    """Enhanced cache manager with Redis backend and intelligent caching"""
    
    def __init__(self):
        self.redis_pool = None
        self.redis_client = None
        self.default_ttl = settings.CACHE_TTL
        self.max_size = settings.CACHE_MAX_SIZE
        
        # Cache statistics
        self.stats = {
            "hits": 0,
            "misses": 0,
            "sets": 0,
            "deletes": 0,
            "errors": 0
        }
    
    async def initialize(self):
        """Initialize Redis connection pool"""
        try:
            self.redis_pool = ConnectionPool.from_url(
                settings.get_redis_url(),
                max_connections=settings.REDIS_MAX_CONNECTIONS,
                retry_on_timeout=True,
                socket_keepalive=True,
                socket_keepalive_options={},
                health_check_interval=30
            )
            
            self.redis_client = redis.Redis(connection_pool=self.redis_pool)
            
            # Test connection
            await self.redis_client.ping()
            logger.info("Redis cache initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Redis cache: {str(e)}")
            self.redis_client = None
    
    async def get(self, key: str, default: Any = None) -> Any:
        """Get value from cache with automatic deserialization"""
        try:
            if not self.redis_client:
                return default
            
            value = await self.redis_client.get(self._format_key(key))
            
            if value is None:
                self.stats["misses"] += 1
                return default
            
            self.stats["hits"] += 1
            return self._deserialize(value)
            
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {str(e)}")
            self.stats["errors"] += 1
            return default
    
    async def set(
        self, 
        key: str, 
        value: Any, 
        expire: Optional[int] = None,
        nx: bool = False
    ) -> bool:
        """Set value in cache with automatic serialization"""
        try:
            if not self.redis_client:
                return False
            
            serialized_value = self._serialize(value)
            ttl = expire or self.default_ttl
            
            result = await self.redis_client.set(
                self._format_key(key),
                serialized_value,
                ex=ttl,
                nx=nx
            )
            
            if result:
                self.stats["sets"] += 1
            
            return bool(result)
            
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {str(e)}")
            self.stats["errors"] += 1
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            if not self.redis_client:
                return False
            
            result = await self.redis_client.delete(self._format_key(key))
            
            if result:
                self.stats["deletes"] += 1
            
            return bool(result)
            
        except Exception as e:
            logger.error(f"Cache delete error for key {key}: {str(e)}")
            self.stats["errors"] += 1
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        try:
            if not self.redis_client:
                return False
            
            return bool(await self.redis_client.exists(self._format_key(key)))
            
        except Exception as e:
            logger.error(f"Cache exists error for key {key}: {str(e)}")
            return False
    
    async def expire(self, key: str, seconds: int) -> bool:
        """Set expiration time for key"""
        try:
            if not self.redis_client:
                return False
            
            return bool(await self.redis_client.expire(self._format_key(key), seconds))
            
        except Exception as e:
            logger.error(f"Cache expire error for key {key}: {str(e)}")
            return False
    
    async def ttl(self, key: str) -> int:
        """Get time to live for key"""
        try:
            if not self.redis_client:
                return -1
            
            return await self.redis_client.ttl(self._format_key(key))
            
        except Exception as e:
            logger.error(f"Cache TTL error for key {key}: {str(e)}")
            return -1
    
    async def increment(self, key: str, amount: int = 1) -> int:
        """Increment numeric value in cache"""
        try:
            if not self.redis_client:
                return 0
            
            return await self.redis_client.incrby(self._format_key(key), amount)
            
        except Exception as e:
            logger.error(f"Cache increment error for key {key}: {str(e)}")
            return 0
    
    async def get_many(self, keys: List[str]) -> Dict[str, Any]:
        """Get multiple values from cache"""
        try:
            if not self.redis_client or not keys:
                return {}
            
            formatted_keys = [self._format_key(key) for key in keys]
            values = await self.redis_client.mget(formatted_keys)
            
            result = {}
            for i, (original_key, value) in enumerate(zip(keys, values)):
                if value is not None:
                    result[original_key] = self._deserialize(value)
                    self.stats["hits"] += 1
                else:
                    self.stats["misses"] += 1
            
            return result
            
        except Exception as e:
            logger.error(f"Cache get_many error: {str(e)}")
            self.stats["errors"] += 1
            return {}
    
    async def set_many(self, mapping: Dict[str, Any], expire: Optional[int] = None) -> bool:
        """Set multiple values in cache"""
        try:
            if not self.redis_client or not mapping:
                return False
            
            pipe = self.redis_client.pipeline()
            ttl = expire or self.default_ttl
            
            for key, value in mapping.items():
                serialized_value = self._serialize(value)
                pipe.set(self._format_key(key), serialized_value, ex=ttl)
            
            results = await pipe.execute()
            success_count = sum(1 for result in results if result)
            
            self.stats["sets"] += success_count
            return success_count == len(mapping)
            
        except Exception as e:
            logger.error(f"Cache set_many error: {str(e)}")
            self.stats["errors"] += 1
            return False
    
    async def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching pattern"""
        try:
            if not self.redis_client:
                return 0
            
            keys = await self.redis_client.keys(self._format_key(pattern))
            if not keys:
                return 0
            
            deleted = await self.redis_client.delete(*keys)
            self.stats["deletes"] += deleted
            
            return deleted
            
        except Exception as e:
            logger.error(f"Cache delete_pattern error for pattern {pattern}: {str(e)}")
            self.stats["errors"] += 1
            return 0
    
    async def clear_all(self) -> bool:
        """Clear all cache entries (use with caution)"""
        try:
            if not self.redis_client:
                return False
            
            await self.redis_client.flushdb()
            logger.warning("All cache entries cleared")
            return True
            
        except Exception as e:
            logger.error(f"Cache clear_all error: {str(e)}")
            self.stats["errors"] += 1
            return False
    
    # User-specific caching methods
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get cached user data"""
        return await self.get(f"user:{user_id}")
    
    async def set_user(self, user_id: str, user_data: Dict[str, Any], expire: int = 1800) -> bool:
        """Cache user data for 30 minutes by default"""
        return await self.set(f"user:{user_id}", user_data, expire)
    
    async def delete_user(self, user_id: str) -> bool:
        """Remove user from cache"""
        return await self.delete(f"user:{user_id}")
    
    # Session management
    async def get_user_session(self, user_id: str) -> Optional[str]:
        """Get user session ID"""
        return await self.get(f"session:{user_id}")
    
    async def set_user_session(self, user_id: str, session_id: str, expire: int = 1800) -> bool:
        """Set user session ID"""
        return await self.set(f"session:{user_id}", session_id, expire)
    
    async def delete_user_session(self, user_id: str) -> bool:
        """Delete user session"""
        return await self.delete(f"session:{user_id}")
    
    async def cleanup_expired_sessions(self) -> int:
        """Clean up expired sessions"""
        try:
            pattern = self._format_key("session:*")
            keys = await self.redis_client.keys(pattern)
            
            expired_count = 0
            for key in keys:
                ttl = await self.redis_client.ttl(key)
                if ttl == -1:  # No expiration set
                    await self.redis_client.expire(key, 1800)  # Set 30 min expiration
                elif ttl == -2:  # Key doesn't exist
                    expired_count += 1
            
            return expired_count
            
        except Exception as e:
            logger.error(f"Session cleanup error: {str(e)}")
            return 0
    
    # Rate limiting
    async def is_rate_limited(self, identifier: str, limit: int = 100, window: int = 3600) -> bool:
        """Check if identifier is rate limited"""
        try:
            if not self.redis_client:
                return False
            
            key = f"rate_limit:{identifier}"
            current = await self.redis_client.get(self._format_key(key))
            
            if current is None:
                await self.redis_client.setex(self._format_key(key), window, 1)
                return False
            
            current_count = int(current)
            if current_count >= limit:
                return True
            
            await self.redis_client.incr(self._format_key(key))
            return False
            
        except Exception as e:
            logger.error(f"Rate limit check error: {str(e)}")
            return False
    
    # Classification result caching
    async def cache_classification_result(
        self, 
        column_hash: str, 
        result: Dict[str, Any], 
        expire: int = 3600
    ) -> bool:
        """Cache classification result"""
        return await self.set(f"classification:{column_hash}", result, expire)
    
    async def get_cached_classification(self, column_hash: str) -> Optional[Dict[str, Any]]:
        """Get cached classification result"""
        return await self.get(f"classification:{column_hash}")
    
    # Analytics caching
    async def cache_dashboard_stats(
        self, 
        user_id: str, 
        time_range: str, 
        stats: Dict[str, Any], 
        expire: int = 300
    ) -> bool:
        """Cache dashboard statistics for 5 minutes"""
        key = f"dashboard_stats:{user_id}:{time_range}"
        return await self.set(key, stats, expire)
    
    async def get_cached_dashboard_stats(
        self, 
        user_id: str, 
        time_range: str
    ) -> Optional[Dict[str, Any]]:
        """Get cached dashboard statistics"""
        key = f"dashboard_stats:{user_id}:{time_range}"
        return await self.get(key)
    
    # Health check
    async def health_check(self) -> Dict[str, Any]:
        """Health check for cache system"""
        try:
            if not self.redis_client:
                return {"status": "unhealthy", "error": "Redis client not initialized"}
            
            start_time = datetime.utcnow()
            await self.redis_client.ping()
            response_time = (datetime.utcnow() - start_time).total_seconds()
            
            info = await self.redis_client.info()
            
            return {
                "status": "healthy",
                "response_time": response_time,
                "connected_clients": info.get("connected_clients", 0),
                "used_memory": info.get("used_memory_human", "unknown"),
                "stats": self.stats
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "stats": self.stats
            }
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_requests = self.stats["hits"] + self.stats["misses"]
        hit_rate = (self.stats["hits"] / total_requests * 100) if total_requests > 0 else 0
        
        return {
            **self.stats,
            "hit_rate": round(hit_rate, 2),
            "total_requests": total_requests
        }
    
    def _format_key(self, key: str) -> str:
        """Format cache key with prefix"""
        return f"{settings.APP_NAME}:{key}"
    
    def _serialize(self, value: Any) -> bytes:
        """Serialize value for storage"""
        try:
            # Try JSON first for simple types
            if isinstance(value, (str, int, float, bool, list, dict, type(None))):
                return json.dumps(value).encode('utf-8')
            else:
                # Use pickle for complex objects
                return pickle.dumps(value)
        except Exception:
            # Fallback to pickle
            return pickle.dumps(value)
    
    def _deserialize(self, value: bytes) -> Any:
        """Deserialize value from storage"""
        try:
            # Try JSON first
            return json.loads(value.decode('utf-8'))
        except (json.JSONDecodeError, UnicodeDecodeError):
            # Fallback to pickle
            return pickle.loads(value)
    
    async def close(self):
        """Close Redis connections"""
        try:
            if self.redis_client:
                await self.redis_client.close()
            if self.redis_pool:
                await self.redis_pool.disconnect()
            logger.info("Redis cache connections closed")
        except Exception as e:
            logger.error(f"Error closing Redis connections: {str(e)}")
