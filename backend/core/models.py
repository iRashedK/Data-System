"""
SQLAlchemy models for the AI Data Classification System
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="analyst")  # admin, data_steward, analyst, auditor
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    
    # Relationships
    data_sources = relationship("DataSource", back_populates="user")
    classification_results = relationship("ClassificationResult", back_populates="user")
    custom_rules = relationship("CustomRule", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")

class DataSource(Base):
    __tablename__ = "data_sources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # file, database
    file_path = Column(String)
    connection_string = Column(String)
    metadata = Column(JSON)
    user_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    last_scanned = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="data_sources")
    classification_results = relationship("ClassificationResult", back_populates="data_source")

class ClassificationResult(Base):
    __tablename__ = "classification_results"
    
    id = Column(Integer, primary_key=True, index=True)
    data_source_id = Column(Integer, ForeignKey("data_sources.id"))
    column_name = Column(String, nullable=False)
    classification_level = Column(String, nullable=False)  # Top Secret, Confidential, Internal, Public
    regulation = Column(String, nullable=False)  # NDMO, GDPR, PDPL, etc.
    justification = Column(Text)
    confidence_score = Column(Float)
    sample_values = Column(JSON)
    is_approved = Column(Boolean, default=False)
    approved_by = Column(String)
    approved_at = Column(DateTime)
    user_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    data_source = relationship("DataSource", back_populates="classification_results")
    user = relationship("User", back_populates="classification_results")

class CustomRule(Base):
    __tablename__ = "custom_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    pattern = Column(String, nullable=False)
    classification_level = Column(String, nullable=False)
    regulation = Column(String, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    user_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="custom_rules")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    details = Column(Text)
    ip_address = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")

class AccessPolicy(Base):
    __tablename__ = "access_policies"
    
    id = Column(Integer, primary_key=True, index=True)
    classification_result_id = Column(Integer, ForeignKey("classification_results.id"))
    allowed_roles = Column(JSON)
    restrictions = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
