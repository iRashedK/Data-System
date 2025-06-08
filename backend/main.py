"""
AI Data Classification System - Enhanced Production Backend
Enterprise-grade data classification with advanced security, monitoring, and AI capabilities
"""

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import logging
import os
import time
from datetime import datetime, timedelta
import uuid
import asyncio
from contextlib import asynccontextmanager

# Monitoring and observability
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from prometheus_client import Counter, Histogram, Gauge, generate_latest
import structlog

# Internal imports
from core.config import settings
from core.database import get_db, engine
from core.security import (
    verify_token, create_access_token, get_password_hash, 
    verify_password, encrypt_sensitive_data, decrypt_sensitive_data
)
from core.models import Base, User, ClassificationResult, DataSource, AuditLog, CustomRule
from core.schemas import *
from core.middleware import (
    SecurityHeadersMiddleware, RateLimitMiddleware, 
    RequestLoggingMiddleware, ErrorHandlingMiddleware
)
from core.cache import CacheManager
from core.exceptions import (
    ClassificationError, DatabaseConnectionError, 
    ValidationError, AuthenticationError
)

# Services
from services.classification_service import EnhancedClassificationService
from services.file_service import EnhancedFileService
from services.database_service import EnhancedDatabaseService
from services.rules_engine import EnhancedRulesEngine
from services.audit_service import EnhancedAuditService
from services.notification_service import NotificationService
from services.compliance_service import ComplianceService
from services.ml_service import MLClassificationService
from services.search_service import SearchService
from services.backup_service import BackupService

# Initialize Sentry for error tracking
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        integrations=[
            FastApiIntegration(auto_enabling_integrations=False),
            SqlalchemyIntegration(),
        ],
        traces_sample_rate=0.1,
        environment=settings.ENVIRONMENT,
    )

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Prometheus metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
CLASSIFICATION_COUNT = Counter('classifications_total', 'Total classifications performed', ['type', 'status'])
ACTIVE_USERS = Gauge('active_users_total', 'Number of active users')
DATABASE_CONNECTIONS = Gauge('database_connections_active', 'Active database connections')

# Application lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown"""
    # Startup
    logger.info("Starting AI Data Classification System")
    
    # Initialize database
    Base.metadata.create_all(bind=engine)
    
    # Initialize services
    await cache_manager.initialize()
    await search_service.initialize()
    
    # Start background tasks
    asyncio.create_task(periodic_health_check())
    asyncio.create_task(cleanup_expired_sessions())
    
    logger.info("Application startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application")
    await cache_manager.close()
    await search_service.close()
    logger.info("Application shutdown complete")

# Initialize FastAPI app with enhanced configuration
app = FastAPI(
    title="AI Data Classification System Pro",
    description="Enterprise-grade data classification system with advanced AI, security, and compliance features",
    version="2.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan,
    openapi_tags=[
        {"name": "Authentication", "description": "User authentication and authorization"},
        {"name": "Classification", "description": "Data classification operations"},
        {"name": "Dashboard", "description": "Analytics and monitoring"},
        {"name": "Rules", "description": "Custom classification rules"},
        {"name": "Compliance", "description": "Compliance and audit features"},
        {"name": "Admin", "description": "Administrative operations"},
    ]
)

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(ErrorHandlingMiddleware)

# CORS middleware with enhanced security
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count", "X-Request-ID"],
)

# Security
security = HTTPBearer()

# Initialize enhanced services
cache_manager = CacheManager()
classification_service = EnhancedClassificationService()
file_service = EnhancedFileService()
database_service = EnhancedDatabaseService()
rules_engine = EnhancedRulesEngine()
audit_service = EnhancedAuditService()
notification_service = NotificationService()
compliance_service = ComplianceService()
ml_service = MLClassificationService()
search_service = SearchService()
backup_service = BackupService()

# Enhanced dependency to get current user with caching
async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user with enhanced security"""
    try:
        # Check rate limiting
        client_ip = request.client.host
        if await cache_manager.is_rate_limited(client_ip):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded"
            )
        
        # Verify token
        payload = verify_token(credentials.credentials)
        user_id = payload.get("sub")
        if user_id is None:
            raise AuthenticationError("Invalid token payload")
        
        # Check cache first
        cached_user = await cache_manager.get_user(user_id)
        if cached_user:
            return cached_user
        
        # Get from database
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        if user is None:
            raise AuthenticationError("User not found or inactive")
        
        # Update last activity
        user.last_activity = datetime.utcnow()
        db.commit()
        
        # Cache user
        await cache_manager.set_user(user_id, user)
        
        # Log access
        await audit_service.log_action(
            db, user.id, "USER_ACCESS", 
            f"User {user.email} accessed system",
            request.client.host
        )
        
        return user
        
    except AuthenticationError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    except Exception as e:
        logger.error("Authentication error", error=str(e), user_id=user_id)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

# Role-based access control decorator
def require_role(required_roles: List[str]):
    """Decorator to require specific roles"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user or current_user.role not in required_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Health and monitoring endpoints
@app.get("/health", tags=["Monitoring"])
async def health_check():
    """Comprehensive health check endpoint"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "services": {}
    }
    
    try:
        # Check database
        db_status = await database_service.health_check()
        health_status["services"]["database"] = db_status
        
        # Check Redis
        redis_status = await cache_manager.health_check()
        health_status["services"]["redis"] = redis_status
        
        # Check Elasticsearch
        search_status = await search_service.health_check()
        health_status["services"]["elasticsearch"] = search_status
        
        # Check AI services
        ai_status = await classification_service.health_check()
        health_status["services"]["ai"] = ai_status
        
        # Overall status
        all_healthy = all(
            service.get("status") == "healthy" 
            for service in health_status["services"].values()
        )
        
        if not all_healthy:
            health_status["status"] = "degraded"
            
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        health_status["status"] = "unhealthy"
        health_status["error"] = str(e)
    
    status_code = 200 if health_status["status"] == "healthy" else 503
    return JSONResponse(content=health_status, status_code=status_code)

@app.get("/metrics", tags=["Monitoring"])
async def get_metrics():
    """Prometheus metrics endpoint"""
    return generate_latest()

@app.get("/info", tags=["Monitoring"])
async def get_system_info(current_user: User = Depends(get_current_user)):
    """Get system information"""
    return {
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "features": {
            "ai_classification": True,
            "multi_language": True,
            "compliance_reporting": True,
            "real_time_monitoring": True,
            "advanced_security": True,
            "ml_enhancement": True
        },
        "supported_regulations": ["NDMO", "PDPL", "GDPR", "NCA", "DAMA", "CCPA", "HIPAA"],
        "supported_languages": ["en", "ar", "fr", "es"],
        "ai_models": await classification_service.get_available_models()
    }

# Enhanced authentication endpoints
@app.post("/auth/register", response_model=UserResponse, tags=["Authentication"])
async def register(
    user_data: UserCreate, 
    request: Request,
    db: Session = Depends(get_db)
):
    """Register a new user with enhanced validation"""
    try:
        # Check if registration is allowed
        if not settings.ALLOW_REGISTRATION and user_data.role == "admin":
            existing_admins = db.query(User).filter(User.role == "admin").count()
            if existing_admins > 0:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Registration is disabled"
                )
        
        # Validate email domain if configured
        if settings.ALLOWED_EMAIL_DOMAINS:
            email_domain = user_data.email.split("@")[1]
            if email_domain not in settings.ALLOWED_EMAIL_DOMAINS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email domain not allowed"
                )
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user with enhanced security
        hashed_password = get_password_hash(user_data.password)
        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password,
            role=user_data.role,
            is_active=True,
            created_at=datetime.utcnow(),
            password_changed_at=datetime.utcnow(),
            failed_login_attempts=0,
            account_locked_until=None
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Send welcome notification
        await notification_service.send_welcome_email(user.email, user.full_name)
        
        # Log the registration
        await audit_service.log_action(
            db, user.id, "USER_REGISTERED", 
            f"User {user.email} registered with role {user.role}",
            request.client.host
        )
        
        # Update metrics
        ACTIVE_USERS.inc()
        
        return UserResponse.from_orm(user)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Registration error", error=str(e), email=user_data.email)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@app.post("/auth/login", response_model=TokenResponse, tags=["Authentication"])
async def login(
    user_data: UserLogin, 
    request: Request,
    db: Session = Depends(get_db)
):
    """Enhanced user authentication with security features"""
    try:
        user = db.query(User).filter(User.email == user_data.email).first()
        
        # Check if user exists
        if not user:
            await audit_service.log_action(
                db, None, "LOGIN_FAILED", 
                f"Login attempt with non-existent email: {user_data.email}",
                request.client.host
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Check if account is locked
        if user.account_locked_until and user.account_locked_until > datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail=f"Account locked until {user.account_locked_until}"
            )
        
        # Verify password
        if not verify_password(user_data.password, user.hashed_password):
            # Increment failed attempts
            user.failed_login_attempts += 1
            
            # Lock account after max attempts
            if user.failed_login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
                user.account_locked_until = datetime.utcnow() + timedelta(minutes=30)
                await notification_service.send_account_locked_email(user.email)
            
            db.commit()
            
            await audit_service.log_action(
                db, user.id, "LOGIN_FAILED", 
                f"Failed login attempt for {user.email}",
                request.client.host
            )
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is disabled"
            )
        
        # Reset failed attempts on successful login
        user.failed_login_attempts = 0
        user.account_locked_until = None
        user.last_login = datetime.utcnow()
        user.last_activity = datetime.utcnow()
        db.commit()
        
        # Create access token with enhanced claims
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "iat": datetime.utcnow(),
            "session_id": str(uuid.uuid4())
        }
        access_token = create_access_token(data=token_data)
        
        # Cache user session
        await cache_manager.set_user_session(user.id, token_data["session_id"])
        
        # Log successful login
        await audit_service.log_action(
            db, user.id, "USER_LOGIN", 
            f"User {user.email} logged in successfully",
            request.client.host
        )
        
        return TokenResponse(
            access_token=access_token, 
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserResponse.from_orm(user)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Login error", error=str(e), email=user_data.email)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

# Enhanced file upload and classification
@app.post("/upload", response_model=ClassificationResponse, tags=["Classification"])
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    classification_options: Optional[ClassificationOptions] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enhanced file upload with advanced classification options"""
    try:
        # Validate file
        validation_result = await file_service.validate_file(file)
        if not validation_result.is_valid:
            raise ValidationError(validation_result.error_message)
        
        # Check user quota
        user_quota = await compliance_service.check_user_quota(current_user.id, db)
        if not user_quota.can_upload:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Upload quota exceeded. Limit: {user_quota.limit}"
            )
        
        # Save file securely
        file_info = await file_service.save_upload_secure(file, current_user.id)
        
        # Extract data with enhanced parsing
        extraction_result = await file_service.extract_columns_enhanced(
            file_info.file_path, 
            classification_options
        )
        
        # Apply custom rules first
        rules = db.query(CustomRule).filter(
            CustomRule.user_id == current_user.id,
            CustomRule.is_active == True
        ).all()
        
        pre_classified = await rules_engine.apply_rules_enhanced(
            extraction_result.columns_data, 
            rules
        )
        
        # Enhanced AI classification with multiple models
        classification_results = await classification_service.classify_columns_enhanced(
            extraction_result.columns_data,
            pre_classified,
            current_user.id,
            classification_options
        )
        
        # ML-based enhancement
        if settings.ENABLE_ML_ENHANCEMENT:
            classification_results = await ml_service.enhance_classifications(
                classification_results,
                extraction_result.metadata
            )
        
        # Store data source with encryption
        data_source = DataSource(
            name=file.filename,
            type="file",
            file_path=encrypt_sensitive_data(file_info.file_path),
            file_hash=file_info.file_hash,
            file_size=file_info.file_size,
            metadata=extraction_result.metadata,
            user_id=current_user.id,
            created_at=datetime.utcnow()
        )
        db.add(data_source)
        db.commit()
        db.refresh(data_source)
        
        # Store classification results with compliance mapping
        for result in classification_results:
            # Generate compliance mapping
            compliance_mapping = await compliance_service.generate_compliance_mapping(
                result, current_user.organization_id if hasattr(current_user, 'organization_id') else None
            )
            
            db_result = ClassificationResult(
                data_source_id=data_source.id,
                column_name=result["column_name"],
                classification_level=result["classification_level"],
                regulation=result["regulation"],
                justification=result["justification"],
                confidence_score=result["confidence_score"],
                sample_values=encrypt_sensitive_data(result["sample_values"]),
                compliance_mapping=compliance_mapping,
                risk_score=result.get("risk_score", 0.0),
                user_id=current_user.id,
                created_at=datetime.utcnow()
            )
            db.add(db_result)
        
        db.commit()
        
        # Index for search
        await search_service.index_classification_results(
            data_source.id, 
            classification_results
        )
        
        # Generate compliance report
        compliance_report = await compliance_service.generate_report(
            classification_results,
            current_user.id
        )
        
        # Send notifications for high-risk classifications
        high_risk_count = sum(
            1 for result in classification_results 
            if result["classification_level"] in ["Top Secret", "Confidential"]
        )
        
        if high_risk_count > 0:
            await notification_service.send_high_risk_alert(
                current_user.email,
                file.filename,
                high_risk_count
            )
        
        # Log the classification
        await audit_service.log_action(
            db, current_user.id, "FILE_CLASSIFIED",
            f"File {file.filename} classified with {len(classification_results)} columns, {high_risk_count} high-risk"
        )
        
        # Update metrics
        CLASSIFICATION_COUNT.labels(type="file", status="success").inc()
        
        # Schedule background tasks
        background_tasks.add_task(file_service.cleanup_file, file_info.file_path, delay=3600)
        background_tasks.add_task(backup_service.backup_classification_results, data_source.id)
        
        return ClassificationResponse(
            data_source_id=data_source.id,
            results=classification_results,
            total_columns=len(classification_results),
            high_risk_columns=high_risk_count,
            compliance_report=compliance_report,
            processing_time=extraction_result.processing_time,
            timestamp=datetime.utcnow()
        )
        
    except (ValidationError, HTTPException):
        raise
    except Exception as e:
        logger.error("File upload error", error=str(e), filename=file.filename, user_id=current_user.id)
        CLASSIFICATION_COUNT.labels(type="file", status="error").inc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File processing failed: {str(e)}"
        )

# Enhanced dashboard with real-time analytics
@app.get("/dashboard/stats", response_model=EnhancedDashboardStats, tags=["Dashboard"])
async def get_enhanced_dashboard_stats(
    time_range: Optional[str] = "7d",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get enhanced dashboard statistics with real-time analytics"""
    try:
        # Check cache first
        cache_key = f"dashboard_stats:{current_user.id}:{time_range}"
        cached_stats = await cache_manager.get(cache_key)
        if cached_stats:
            return cached_stats
        
        # Calculate time range
        end_date = datetime.utcnow()
        if time_range == "24h":
            start_date = end_date - timedelta(hours=24)
        elif time_range == "7d":
            start_date = end_date - timedelta(days=7)
        elif time_range == "30d":
            start_date = end_date - timedelta(days=30)
        else:
            start_date = end_date - timedelta(days=7)
        
        # Get user's classification results
        results = db.query(ClassificationResult).filter(
            ClassificationResult.user_id == current_user.id,
            ClassificationResult.created_at >= start_date
        ).all()
        
        # Enhanced analytics
        stats = await analytics_service.calculate_enhanced_stats(
            results, start_date, end_date, current_user.id, db
        )
        
        # Real-time compliance monitoring
        compliance_status = await compliance_service.get_real_time_status(
            current_user.id, db
        )
        
        # Risk assessment
        risk_assessment = await compliance_service.calculate_risk_score(
            results, current_user.id
        )
        
        # Trend analysis
        trend_analysis = await analytics_service.calculate_trends(
            current_user.id, start_date, end_date, db
        )
        
        enhanced_stats = EnhancedDashboardStats(
            **stats,
            compliance_status=compliance_status,
            risk_assessment=risk_assessment,
            trend_analysis=trend_analysis,
            real_time_alerts=await notification_service.get_active_alerts(current_user.id),
            recommendations=await ml_service.get_recommendations(current_user.id, results)
        )
        
        # Cache results
        await cache_manager.set(cache_key, enhanced_stats, expire=300)  # 5 minutes
        
        return enhanced_stats
        
    except Exception as e:
        logger.error("Dashboard stats error", error=str(e), user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dashboard statistics"
        )

# Advanced search and filtering
@app.get("/search", response_model=SearchResponse, tags=["Search"])
async def search_classifications(
    query: str,
    filters: Optional[SearchFilters] = None,
    page: int = 1,
    size: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Advanced search across classification results"""
    try:
        search_results = await search_service.search_classifications(
            query=query,
            filters=filters,
            user_id=current_user.id,
            page=page,
            size=size
        )
        
        # Log search activity
        await audit_service.log_action(
            db, current_user.id, "SEARCH_PERFORMED",
            f"Search query: {query}, results: {search_results.total}"
        )
        
        return search_results
        
    except Exception as e:
        logger.error("Search error", error=str(e), query=query, user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Search failed"
        )

# Compliance and reporting endpoints
@app.get("/compliance/report", response_model=ComplianceReport, tags=["Compliance"])
async def generate_compliance_report(
    regulation: str,
    format: str = "json",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate comprehensive compliance report"""
    try:
        if current_user.role not in ["admin", "data_steward", "auditor"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions for compliance reporting"
            )
        
        report = await compliance_service.generate_comprehensive_report(
            user_id=current_user.id,
            regulation=regulation,
            format=format,
            db=db
        )
        
        # Log report generation
        await audit_service.log_action(
            db, current_user.id, "COMPLIANCE_REPORT_GENERATED",
            f"Generated {regulation} compliance report in {format} format"
        )
        
        return report
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Compliance report error", error=str(e), regulation=regulation, user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate compliance report"
        )

# Background tasks and monitoring
async def periodic_health_check():
    """Periodic health check for all services"""
    while True:
        try:
            await asyncio.sleep(300)  # 5 minutes
            
            # Check all services
            services_status = {
                "database": await database_service.health_check(),
                "redis": await cache_manager.health_check(),
                "elasticsearch": await search_service.health_check(),
                "ai": await classification_service.health_check()
            }
            
            # Update metrics
            for service, status in services_status.items():
                if status.get("status") != "healthy":
                    logger.warning(f"Service {service} is unhealthy", status=status)
                    await notification_service.send_service_alert(service, status)
            
        except Exception as e:
            logger.error("Health check error", error=str(e))

async def cleanup_expired_sessions():
    """Clean up expired user sessions"""
    while True:
        try:
            await asyncio.sleep(3600)  # 1 hour
            await cache_manager.cleanup_expired_sessions()
            logger.info("Cleaned up expired sessions")
        except Exception as e:
            logger.error("Session cleanup error", error=str(e))

# Error handlers
@app.exception_handler(ValidationError)
async def validation_error_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc), "type": "validation_error"}
    )

@app.exception_handler(AuthenticationError)
async def auth_error_handler(request: Request, exc: AuthenticationError):
    return JSONResponse(
        status_code=401,
        content={"detail": str(exc), "type": "authentication_error"}
    )

@app.exception_handler(ClassificationError)
async def classification_error_handler(request: Request, exc: ClassificationError):
    return JSONResponse(
        status_code=422,
        content={"detail": str(exc), "type": "classification_error"}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": "internal_error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development",
        workers=1 if settings.ENVIRONMENT == "development" else 4
    )
