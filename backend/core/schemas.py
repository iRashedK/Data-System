"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    DATA_STEWARD = "data_steward"
    ANALYST = "analyst"
    AUDITOR = "auditor"

class ClassificationLevel(str, Enum):
    TOP_SECRET = "Top Secret"
    CONFIDENTIAL = "Confidential"
    INTERNAL = "Internal"
    PUBLIC = "Public"

class Regulation(str, Enum):
    NDMO = "NDMO"
    GDPR = "GDPR"
    PDPL = "PDPL"
    NCA = "NCA"
    DAMA = "DAMA"

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.ANALYST

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Data source schemas
class DataSourceCreate(BaseModel):
    name: str
    type: str  # file, database
    connection_string: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class DataSourceResponse(BaseModel):
    id: int
    name: str
    type: str
    created_at: datetime
    last_scanned: Optional[datetime]
    
    class Config:
        from_attributes = True

# Classification schemas
class ClassificationRequest(BaseModel):
    column_name: str
    sample_values: List[Any]
    data_type: Optional[str] = None
    table_name: Optional[str] = None

class ClassificationResultSchema(BaseModel):
    column_name: str
    classification_level: ClassificationLevel
    regulation: Regulation
    justification: str
    confidence_score: float
    sample_values: List[Any]

class ClassificationResponse(BaseModel):
    data_source_id: int
    results: List[Dict[str, Any]]
    total_columns: int
    timestamp: datetime

# Custom rule schemas
class CustomRuleCreate(BaseModel):
    name: str
    pattern: str
    classification_level: ClassificationLevel
    regulation: Regulation
    description: Optional[str] = None

class CustomRuleResponse(BaseModel):
    id: int
    name: str
    pattern: str
    classification_level: str
    regulation: str
    description: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard schemas
class DashboardStats(BaseModel):
    total_columns: int
    compliance_percentages: Dict[str, float]
    high_risk_fields: int
    last_classification_date: Optional[datetime]
    classification_distribution: Dict[str, int]
    weekly_trend: List[Dict[str, Any]]

# Access policy schemas
class AccessPolicyCreate(BaseModel):
    classification_result_id: int
    allowed_roles: List[UserRole]
    restrictions: Dict[str, Any]

class AccessPolicyResponse(BaseModel):
    id: int
    allowed_roles: List[str]
    restrictions: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True
