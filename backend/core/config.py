"""
Enhanced configuration settings with comprehensive security and feature flags
"""

from pydantic_settings import BaseSettings
from typing import List, Optional, Dict, Any
import os
from pathlib import Path

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "AI Data Classification System Pro"
    VERSION: str = "2.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    
    # Security
    JWT_SECRET: str = "your-super-secret-jwt-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ENCRYPTION_KEY: str = "your-32-char-encryption-key-here"
    
    # Authentication & Authorization
    MAX_LOGIN_ATTEMPTS: int = 5
    ACCOUNT_LOCKOUT_DURATION: int = 30  # minutes
    PASSWORD_MIN_LENGTH: int = 12
    PASSWORD_REQUIRE_SPECIAL: bool = True
    PASSWORD_REQUIRE_NUMBERS: bool = True
    PASSWORD_REQUIRE_UPPERCASE: bool = True
    ALLOW_REGISTRATION: bool = True
    ALLOWED_EMAIL_DOMAINS: Optional[List[str]] = None
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres123@localhost:5432/data_classifier"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 30
    DATABASE_POOL_TIMEOUT: int = 30
    DATABASE_POOL_RECYCLE: int = 3600
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0
    REDIS_MAX_CONNECTIONS: int = 100
    
    # Elasticsearch
    ELASTICSEARCH_URL: str = "http://localhost:9200"
    ELASTICSEARCH_INDEX_PREFIX: str = "data_classifier"
    ELASTICSEARCH_TIMEOUT: int = 30
    
    # MinIO/S3
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin123"
    MINIO_BUCKET_NAME: str = "data-classifier"
    MINIO_SECURE: bool = False
    
    # AI Services
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_API_URL: str = "https://openrouter.ai/api/v1/chat/completions"
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    DEFAULT_AI_MODEL: str = "anthropic/claude-3-opus"
    AI_REQUEST_TIMEOUT: int = 60
    AI_MAX_RETRIES: int = 3
    AI_RATE_LIMIT: int = 100  # requests per hour
    
    # File Processing
    MAX_FILE_SIZE: int = 500 * 1024 * 1024  # 500MB
    ALLOWED_FILE_TYPES: List[str] = [".xlsx", ".xls", ".csv", ".json", ".parquet"]
    UPLOAD_DIR: str = "uploads"
    TEMP_DIR: str = "temp"
    VIRUS_SCAN_ENABLED: bool = True
    
    # Classification
    DEFAULT_SAMPLE_SIZE: int = 20
    MAX_SAMPLE_SIZE: int = 100
    CONFIDENCE_THRESHOLD: float = 0.7
    ENABLE_ML_ENHANCEMENT: bool = True
    ENABLE_PATTERN_LEARNING: bool = True
    AUTO_APPROVAL_THRESHOLD: float = 0.95
    
    # Compliance & Regulations
    SUPPORTED_REGULATIONS: List[str] = ["NDMO", "PDPL", "GDPR", "NCA", "DAMA", "CCPA", "HIPAA", "SOX"]
    DEFAULT_REGULATION: str = "PDPL"
    COMPLIANCE_RETENTION_YEARS: int = 7
    AUTO_COMPLIANCE_MAPPING: bool = True
    
    # Monitoring & Observability
    SENTRY_DSN: Optional[str] = None
    LOG_LEVEL: str = "INFO"
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    ENABLE_TRACING: bool = True
    JAEGER_ENDPOINT: Optional[str] = None
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 1000
    RATE_LIMIT_WINDOW: int = 3600  # seconds
    RATE_LIMIT_STORAGE: str = "redis"
    
    # Caching
    CACHE_TTL: int = 3600  # seconds
    CACHE_MAX_SIZE: int = 1000
    ENABLE_QUERY_CACHE: bool = True
    ENABLE_RESULT_CACHE: bool = True
    
    # Background Tasks
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    CELERY_TASK_TIMEOUT: int = 3600
    ENABLE_SCHEDULED_TASKS: bool = True
    
    # Notifications
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_TLS: bool = True
    EMAIL_FROM: str = "noreply@dataclassifier.com"
    
    SLACK_WEBHOOK_URL: Optional[str] = None
    TEAMS_WEBHOOK_URL: Optional[str] = None
    
    # Backup & Recovery
    BACKUP_ENABLED: bool = True
    BACKUP_SCHEDULE: str = "0 2 * * *"  # Daily at 2 AM
    BACKUP_RETENTION_DAYS: int = 30
    BACKUP_STORAGE: str = "minio"
    
    # Multi-tenancy
    ENABLE_MULTI_TENANCY: bool = False
    DEFAULT_TENANT: str = "default"
    TENANT_ISOLATION_LEVEL: str = "database"  # database, schema, row
    
    # Internationalization
    DEFAULT_LANGUAGE: str = "en"
    SUPPORTED_LANGUAGES: List[str] = ["en", "ar", "fr", "es", "de"]
    TIMEZONE: str = "UTC"
    
    # Feature Flags
    FEATURES: Dict[str, bool] = {
        "advanced_ai": True,
        "ml_enhancement": True,
        "real_time_classification": True,
        "batch_processing": True,
        "api_integrations": True,
        "custom_models": True,
        "data_lineage": True,
        "privacy_impact_assessment": True,
        "automated_remediation": True,
        "risk_scoring": True
    }
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    DOCS_URL: Optional[str] = "/docs"
    REDOC_URL: Optional[str] = "/redoc"
    OPENAPI_URL: str = "/openapi.json"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "*"]
    
    # Performance
    MAX_CONCURRENT_CLASSIFICATIONS: int = 10
    CLASSIFICATION_QUEUE_SIZE: int = 1000
    WORKER_PROCESSES: int = 4
    WORKER_THREADS: int = 2
    
    # Data Retention
    AUDIT_LOG_RETENTION_DAYS: int = 2555  # 7 years
    CLASSIFICATION_RESULT_RETENTION_DAYS: int = 2555
    TEMP_FILE_RETENTION_HOURS: int = 24
    SESSION_RETENTION_DAYS: int = 30
    
    # Integration APIs
    ENABLE_WEBHOOK_NOTIFICATIONS: bool = True
    WEBHOOK_TIMEOUT: int = 30
    WEBHOOK_MAX_RETRIES: int = 3
    
    # Custom Model Training
    ENABLE_CUSTOM_MODEL_TRAINING: bool = True
    MODEL_TRAINING_SCHEDULE: str = "0 3 * * 0"  # Weekly on Sunday at 3 AM
    MIN_TRAINING_SAMPLES: int = 1000
    MODEL_ACCURACY_THRESHOLD: float = 0.85
    
    # Data Quality
    ENABLE_DATA_QUALITY_CHECKS: bool = True
    DATA_QUALITY_THRESHOLD: float = 0.8
    AUTO_DATA_PROFILING: bool = True
    
    # Privacy & Security
    ENABLE_DATA_MASKING: bool = True
    ENABLE_FIELD_LEVEL_ENCRYPTION: bool = True
    ENABLE_AUDIT_TRAIL: bool = True
    ENABLE_DATA_LINEAGE: bool = True
    PII_DETECTION_ENABLED: bool = True
    
    # Development & Testing
    ENABLE_TEST_MODE: bool = False
    MOCK_AI_RESPONSES: bool = False
    ENABLE_PROFILING: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        
    def get_database_url(self) -> str:
        """Get database URL with proper encoding"""
        return self.DATABASE_URL
    
    def get_redis_url(self) -> str:
        """Get Redis URL with authentication"""
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_URL.split('://', 1)[1]}"
        return self.REDIS_URL
    
    def is_feature_enabled(self, feature: str) -> bool:
        """Check if a feature is enabled"""
        return self.FEATURES.get(feature, False)
    
    def get_ai_config(self) -> Dict[str, Any]:
        """Get AI service configuration"""
        return {
            "openrouter_api_key": self.OPENROUTER_API_KEY,
            "anthropic_api_key": self.ANTHROPIC_API_KEY,
            "openai_api_key": self.OPENAI_API_KEY,
            "default_model": self.DEFAULT_AI_MODEL,
            "timeout": self.AI_REQUEST_TIMEOUT,
            "max_retries": self.AI_MAX_RETRIES,
            "rate_limit": self.AI_RATE_LIMIT
        }

# Global settings instance
settings = Settings()

# Validate critical settings
if settings.ENVIRONMENT == "production":
    assert settings.JWT_SECRET != "your-super-secret-jwt-key-change-in-production", "Change JWT_SECRET in production"
    assert settings.ENCRYPTION_KEY != "your-32-char-encryption-key-here", "Change ENCRYPTION_KEY in production"
    assert len(settings.ENCRYPTION_KEY) == 32, "ENCRYPTION_KEY must be 32 characters"
    assert settings.DEBUG is False, "DEBUG must be False in production"
