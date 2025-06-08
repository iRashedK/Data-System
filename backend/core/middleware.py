"""
Enhanced middleware for security, monitoring, and performance
"""

import time
import uuid
import logging
from typing import Callable, Dict, Any
from datetime import datetime, timedelta
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from starlette.status import HTTP_429_TOO_MANY_REQUESTS, HTTP_403_FORBIDDEN
import structlog

from core.config import settings
from core.cache import CacheManager

logger = structlog.get_logger()

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Content Security Policy
        if settings.ENVIRONMENT == "production":
            csp = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self' https:; "
                "connect-src 'self' https:; "
                "frame-ancestors 'none';"
            )
            response.headers["Content-Security-Policy"] = csp
        
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware with Redis backend"""
    
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.cache_manager = CacheManager()
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if not settings.RATE_LIMIT_ENABLED:
            return await call_next(request)
        
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/metrics"]:
            return await call_next(request)
        
        client_ip = self._get_client_ip(request)
        
        # Check rate limit
        is_limited = await self._check_rate_limit(client_ip)
        if is_limited:
            return JSONResponse(
                status_code=HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "Rate limit exceeded",
                    "retry_after": 60
                },
                headers={"Retry-After": "60"}
            )
        
        return await call_next(request)
    
    def _get_client_ip(self, request: Request) -> str:
        """Get client IP address considering proxies"""
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        return request.client.host
    
    async def _check_rate_limit(self, client_ip: str) -> bool:
        """Check if client has exceeded rate limit"""
        key = f"rate_limit:{client_ip}"
        
        try:
            current_requests = await self.cache_manager.get(key) or 0
            
            if current_requests >= self.requests_per_minute:
                return True
            
            # Increment counter
            await self.cache_manager.set(key, current_requests + 1, expire=60)
            return False
            
        except Exception as e:
            logger.error("Rate limit check failed", error=str(e), client_ip=client_ip)
            return False  # Allow request if rate limiting fails

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Enhanced request logging with structured logging"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Start timing
        start_time = time.time()
        
        # Log request
        logger.info(
            "Request started",
            request_id=request_id,
            method=request.method,
            url=str(request.url),
            client_ip=request.client.host,
            user_agent=request.headers.get("User-Agent", ""),
            content_length=request.headers.get("Content-Length", 0)
        )
        
        try:
            response = await call_next(request)
            
            # Calculate duration
            duration = time.time() - start_time
            
            # Log response
            logger.info(
                "Request completed",
                request_id=request_id,
                status_code=response.status_code,
                duration=duration,
                response_size=response.headers.get("Content-Length", 0)
            )
            
            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id
            
            return response
            
        except Exception as e:
            duration = time.time() - start_time
            
            logger.error(
                "Request failed",
                request_id=request_id,
                error=str(e),
                duration=duration
            )
            
            raise

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Global error handling middleware"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            return await call_next(request)
            
        except Exception as e:
            request_id = getattr(request.state, "request_id", "unknown")
            
            logger.error(
                "Unhandled exception",
                request_id=request_id,
                error=str(e),
                error_type=type(e).__name__,
                path=request.url.path,
                method=request.method
            )
            
            # Return appropriate error response
            if settings.ENVIRONMENT == "development":
                return JSONResponse(
                    status_code=500,
                    content={
                        "detail": str(e),
                        "type": type(e).__name__,
                        "request_id": request_id
                    }
                )
            else:
                return JSONResponse(
                    status_code=500,
                    content={
                        "detail": "Internal server error",
                        "request_id": request_id
                    }
                )

class PerformanceMonitoringMiddleware(BaseHTTPMiddleware):
    """Performance monitoring and metrics collection"""
    
    def __init__(self, app):
        super().__init__(app)
        self.slow_request_threshold = 5.0  # seconds
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        
        response = await call_next(request)
        
        duration = time.time() - start_time
        
        # Log slow requests
        if duration > self.slow_request_threshold:
            logger.warning(
                "Slow request detected",
                path=request.url.path,
                method=request.method,
                duration=duration,
                status_code=response.status_code
            )
        
        # Update metrics (if Prometheus is enabled)
        if settings.ENABLE_METRICS:
            from main import REQUEST_COUNT, REQUEST_DURATION
            REQUEST_COUNT.labels(
                method=request.method,
                endpoint=request.url.path,
                status=response.status_code
            ).inc()
            REQUEST_DURATION.observe(duration)
        
        return response

class CORSMiddleware(BaseHTTPMiddleware):
    """Enhanced CORS middleware with security considerations"""
    
    def __init__(self, app, allowed_origins: list = None):
        super().__init__(app)
        self.allowed_origins = allowed_origins or settings.ALLOWED_ORIGINS
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        origin = request.headers.get("Origin")
        
        # Handle preflight requests
        if request.method == "OPTIONS":
            response = Response()
            self._add_cors_headers(response, origin)
            return response
        
        response = await call_next(request)
        self._add_cors_headers(response, origin)
        
        return response
    
    def _add_cors_headers(self, response: Response, origin: str = None):
        """Add CORS headers to response"""
        
        # Check if origin is allowed
        if origin and (origin in self.allowed_origins or "*" in self.allowed_origins):
            response.headers["Access-Control-Allow-Origin"] = origin
        elif not origin:
            response.headers["Access-Control-Allow-Origin"] = "*"
        
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = (
            "Authorization, Content-Type, X-Requested-With, X-Request-ID"
        )
        response.headers["Access-Control-Expose-Headers"] = "X-Request-ID, X-Total-Count"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Max-Age"] = "86400"  # 24 hours

class CompressionMiddleware(BaseHTTPMiddleware):
    """Response compression middleware"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        
        # Check if client accepts compression
        accept_encoding = request.headers.get("Accept-Encoding", "")
        
        if "gzip" in accept_encoding and self._should_compress(response):
            # Compression is handled by GZipMiddleware in main.py
            pass
        
        return response
    
    def _should_compress(self, response: Response) -> bool:
        """Determine if response should be compressed"""
        
        # Don't compress small responses
        content_length = response.headers.get("Content-Length")
        if content_length and int(content_length) < 1000:
            return False
        
        # Don't compress already compressed content
        content_type = response.headers.get("Content-Type", "")
        if any(ct in content_type for ct in ["image/", "video/", "audio/", "application/zip"]):
            return False
        
        return True

class AuthenticationMiddleware(BaseHTTPMiddleware):
    """Enhanced authentication middleware with session management"""
    
    def __init__(self, app):
        super().__init__(app)
        self.cache_manager = CacheManager()
        self.public_paths = [
            "/health", "/metrics", "/docs", "/redoc", "/openapi.json",
            "/auth/login", "/auth/register", "/auth/forgot-password"
        ]
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Skip authentication for public paths
        if any(request.url.path.startswith(path) for path in self.public_paths):
            return await call_next(request)
        
        # Check for authentication header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Authentication required"}
            )
        
        token = auth_header.split(" ")[1]
        
        # Validate token and check session
        try:
            from core.security import verify_token
            payload = verify_token(token)
            user_id = payload.get("sub")
            session_id = payload.get("session_id")
            
            # Check if session is still valid
            if session_id:
                valid_session = await self.cache_manager.get_user_session(user_id)
                if not valid_session or valid_session != session_id:
                    return JSONResponse(
                        status_code=401,
                        content={"detail": "Session expired"}
                    )
            
            # Add user info to request state
            request.state.user_id = user_id
            request.state.session_id = session_id
            
        except Exception as e:
            logger.warning("Authentication failed", error=str(e), token=token[:20] + "...")
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid authentication credentials"}
            )
        
        return await call_next(request)
