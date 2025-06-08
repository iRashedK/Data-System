"""
Enhanced AI-powered classification service with multiple AI providers and advanced features
"""

import asyncio
import httpx
import json
import logging
import time
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum

from core.config import settings
from core.cache import CacheManager
from core.exceptions import ClassificationError, AIServiceError
from services.ml_service import MLClassificationService
from utils.text_processing import TextProcessor
from utils.pattern_detection import PatternDetector

logger = logging.getLogger(__name__)

class AIProvider(Enum):
    OPENROUTER = "openrouter"
    ANTHROPIC = "anthropic"
    OPENAI = "openai"
    LOCAL_MODEL = "local"

@dataclass
class ClassificationOptions:
    """Enhanced classification options"""
    ai_provider: AIProvider = AIProvider.OPENROUTER
    model_name: Optional[str] = None
    confidence_threshold: float = 0.7
    enable_ml_enhancement: bool = True
    enable_pattern_detection: bool = True
    sample_size: int = 10
    language: str = "en"
    regulation_focus: Optional[str] = None
    custom_rules_only: bool = False
    enable_explanation: bool = True
    enable_risk_scoring: bool = True

@dataclass
class ClassificationResult:
    """Enhanced classification result"""
    column_name: str
    classification_level: str
    regulation: str
    justification: str
    confidence_score: float
    risk_score: float
    sample_values: List[Any]
    patterns_detected: List[str]
    ai_provider: str
    model_used: str
    processing_time: float
    explanation: Optional[str] = None
    recommendations: List[str] = None
    compliance_notes: List[str] = None

class EnhancedClassificationService:
    """Enhanced classification service with multiple AI providers and advanced features"""
    
    def __init__(self):
        self.cache_manager = CacheManager()
        self.ml_service = MLClassificationService()
        self.text_processor = TextProcessor()
        self.pattern_detector = PatternDetector()
        
        # Initialize AI clients
        self.clients = {
            AIProvider.OPENROUTER: httpx.AsyncClient(timeout=settings.AI_REQUEST_TIMEOUT),
            AIProvider.ANTHROPIC: httpx.AsyncClient(timeout=settings.AI_REQUEST_TIMEOUT),
            AIProvider.OPENAI: httpx.AsyncClient(timeout=settings.AI_REQUEST_TIMEOUT),
        }
        
        # Rate limiting
        self.rate_limits = {
            provider: asyncio.Semaphore(settings.AI_RATE_LIMIT) 
            for provider in AIProvider
        }
        
        # Model configurations
        self.model_configs = {
            AIProvider.OPENROUTER: {
                "url": "https://openrouter.ai/api/v1/chat/completions",
                "models": ["anthropic/claude-3-opus", "openai/gpt-4-turbo", "meta-llama/llama-3-70b"],
                "headers": lambda: {"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}"}
            },
            AIProvider.ANTHROPIC: {
                "url": "https://api.anthropic.com/v1/messages",
                "models": ["claude-3-opus-20240229", "claude-3-sonnet-20240229"],
                "headers": lambda: {
                    "x-api-key": settings.ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01"
                }
            },
            AIProvider.OPENAI: {
                "url": "https://api.openai.com/v1/chat/completions",
                "models": ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
                "headers": lambda: {"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
            }
        }
    
    async def classify_columns_enhanced(
        self,
        columns_data: Dict[str, List[Any]],
        pre_classified: Dict[str, Dict[str, Any]],
        user_id: str,
        options: Optional[ClassificationOptions] = None
    ) -> List[ClassificationResult]:
        """Enhanced column classification with multiple AI providers and advanced features"""
        
        if options is None:
            options = ClassificationOptions()
        
        results = []
        start_time = time.time()
        
        # Process columns in batches for better performance
        batch_size = min(10, settings.MAX_CONCURRENT_CLASSIFICATIONS)
        column_items = list(columns_data.items())
        
        for i in range(0, len(column_items), batch_size):
            batch = column_items[i:i + batch_size]
            batch_tasks = []
            
            for column_name, sample_values in batch:
                # Skip if already classified by rules
                if column_name in pre_classified:
                    result = self._convert_pre_classified_result(
                        pre_classified[column_name], options
                    )
                    results.append(result)
                    continue
                
                # Create classification task
                task = self._classify_single_column_enhanced(
                    column_name, sample_values, user_id, options
                )
                batch_tasks.append(task)
            
            # Execute batch
            if batch_tasks:
                batch_results = await asyncio.gather(*batch_tasks, return_exceptions=True)
                
                for result in batch_results:
                    if isinstance(result, Exception):
                        logger.error(f"Classification error: {result}")
                        # Add fallback result
                        results.append(self._create_fallback_result(
                            column_items[len(results)][0], 
                            column_items[len(results)][1], 
                            options
                        ))
                    else:
                        results.append(result)
        
        total_time = time.time() - start_time
        logger.info(f"Classified {len(results)} columns in {total_time:.2f}s")
        
        # ML enhancement if enabled
        if options.enable_ml_enhancement and settings.ENABLE_ML_ENHANCEMENT:
            results = await self.ml_service.enhance_classifications(results, user_id)
        
        return results
    
    async def _classify_single_column_enhanced(
        self,
        column_name: str,
        sample_values: List[Any],
        user_id: str,
        options: ClassificationOptions
    ) -> ClassificationResult:
        """Classify a single column with enhanced AI analysis"""
        
        start_time = time.time()
        
        try:
            # Check cache first
            cache_key = self._generate_cache_key(column_name, sample_values, options)
            cached_result = await self.cache_manager.get(cache_key)
            if cached_result:
                return cached_result
            
            # Pattern detection
            detected_patterns = []
            if options.enable_pattern_detection:
                detected_patterns = await self.pattern_detector.detect_patterns(
                    column_name, sample_values
                )
            
            # Text processing and feature extraction
            processed_data = await self.text_processor.process_column_data(
                column_name, sample_values, options.language
            )
            
            # AI classification with fallback providers
            ai_result = await self._classify_with_ai_fallback(
                column_name, sample_values, processed_data, detected_patterns, options
            )
            
            # Risk scoring
            risk_score = 0.0
            if options.enable_risk_scoring:
                risk_score = await self._calculate_risk_score(
                    ai_result, detected_patterns, processed_data
                )
            
            # Create enhanced result
            result = ClassificationResult(
                column_name=column_name,
                classification_level=ai_result["classification_level"],
                regulation=ai_result["regulation"],
                justification=ai_result["justification"],
                confidence_score=ai_result["confidence_score"],
                risk_score=risk_score,
                sample_values=sample_values[:options.sample_size],
                patterns_detected=detected_patterns,
                ai_provider=ai_result["provider"],
                model_used=ai_result["model"],
                processing_time=time.time() - start_time,
                explanation=ai_result.get("explanation"),
                recommendations=ai_result.get("recommendations", []),
                compliance_notes=ai_result.get("compliance_notes", [])
            )
            
            # Cache result
            await self.cache_manager.set(cache_key, result, expire=3600)
            
            return result
            
        except Exception as e:
            logger.error(f"Enhanced classification failed for {column_name}: {str(e)}")
            return self._create_fallback_result(column_name, sample_values, options)
    
    async def _classify_with_ai_fallback(
        self,
        column_name: str,
        sample_values: List[Any],
        processed_data: Dict[str, Any],
        detected_patterns: List[str],
        options: ClassificationOptions
    ) -> Dict[str, Any]:
        """Classify with AI using fallback providers"""
        
        providers_to_try = [options.ai_provider]
        
        # Add fallback providers
        if options.ai_provider != AIProvider.OPENROUTER:
            providers_to_try.append(AIProvider.OPENROUTER)
        if options.ai_provider != AIProvider.ANTHROPIC:
            providers_to_try.append(AIProvider.ANTHROPIC)
        
        last_error = None
        
        for provider in providers_to_try:
            try:
                async with self.rate_limits[provider]:
                    result = await self._call_ai_provider(
                        provider, column_name, sample_values, 
                        processed_data, detected_patterns, options
                    )
                    result["provider"] = provider.value
                    return result
                    
            except Exception as e:
                last_error = e
                logger.warning(f"AI provider {provider.value} failed: {str(e)}")
                continue
        
        # All providers failed, use fallback
        logger.error(f"All AI providers failed for {column_name}: {last_error}")
        return self._create_ai_fallback_result(
            column_name, sample_values, detected_patterns, options
        )
    
    async def _call_ai_provider(
        self,
        provider: AIProvider,
        column_name: str,
        sample_values: List[Any],
        processed_data: Dict[str, Any],
        detected_patterns: List[str],
        options: ClassificationOptions
    ) -> Dict[str, Any]:
        """Call specific AI provider for classification"""
        
        if provider == AIProvider.LOCAL_MODEL:
            return await self._classify_with_local_model(
                column_name, sample_values, processed_data, detected_patterns, options
            )
        
        config = self.model_configs[provider]
        client = self.clients[provider]
        
        # Build enhanced prompt
        prompt = self._build_enhanced_prompt(
            column_name, sample_values, processed_data, detected_patterns, options
        )
        
        # Select best model for provider
        model = options.model_name or config["models"][0]
        
        # Prepare request
        if provider == AIProvider.ANTHROPIC:
            payload = {
                "model": model,
                "max_tokens": 2000,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1
            }
        else:
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},
                "temperature": 0.1,
                "max_tokens": 2000
            }
        
        # Make API call
        response = await client.post(
            config["url"],
            headers=config["headers"](),
            json=payload
        )
        
        if response.status_code != 200:
            raise AIServiceError(f"AI API error: {response.status_code} - {response.text}")
        
        result = response.json()
        
        # Parse response based on provider
        if provider == AIProvider.ANTHROPIC:
            content = result["content"][0]["text"]
        else:
            content = result["choices"][0]["message"]["content"]
        
        # Parse JSON response
        try:
            classification = json.loads(content)
            classification["model"] = model
            return self._validate_ai_response(classification, column_name, sample_values)
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response: {content}")
            raise AIServiceError(f"Invalid AI response format: {str(e)}")
    
    def _build_enhanced_prompt(
        self,
        column_name: str,
        sample_values: List[Any],
        processed_data: Dict[str, Any],
        detected_patterns: List[str],
        options: ClassificationOptions
    ) -> str:
        """Build enhanced classification prompt with context and patterns"""
        
        # Convert sample values to strings and limit
        sample_str = ", ".join([str(v) for v in sample_values[:options.sample_size] if v is not None])
        
        # Build context information
        context_info = []
        if detected_patterns:
            context_info.append(f"Detected patterns: {', '.join(detected_patterns)}")
        
        if processed_data.get("data_type"):
            context_info.append(f"Data type: {processed_data['data_type']}")
        
        if processed_data.get("statistics"):
            stats = processed_data["statistics"]
            context_info.append(f"Statistics: {stats}")
        
        context_str = "\n".join(context_info) if context_info else "No additional context available."
        
        # Regulation-specific guidance
        regulation_guidance = ""
        if options.regulation_focus:
            regulation_guidance = self._get_regulation_guidance(options.regulation_focus)
        
        # Language-specific considerations
        language_note = ""
        if options.language != "en":
            language_note = f"\nNote: Data is in {options.language}. Consider cultural and linguistic context."
        
        prompt = f"""
You are a world-class data governance expert specializing in data classification according to international regulations and privacy laws.

TASK: Classify the following data column with the highest accuracy and provide comprehensive analysis.

COLUMN INFORMATION:
- Column Name: {column_name}
- Sample Values: {sample_str}
- Context: {context_str}{language_note}

CLASSIFICATION LEVELS (choose exactly one):
1. "Top Secret" - Highly sensitive data that could cause severe damage if disclosed (e.g., national security, biometric data, financial account numbers)
2. "Confidential" - Sensitive personal data requiring protection (e.g., PII, contact information, health data)
3. "Internal" - Internal business data with limited access (e.g., employee data, internal processes)
4. "Public" - Data that can be freely shared (e.g., public information, marketing content)

REGULATIONS TO CONSIDER:
- NDMO (Saudi National Data Management Office) - Saudi data governance framework
- PDPL (Saudi Personal Data Protection Law) - Saudi privacy law
- GDPR (EU General Data Protection Regulation) - European privacy law
- NCA (Saudi National Cybersecurity Authority) - Cybersecurity requirements
- DAMA (Data Management Framework) - International data management standards
- CCPA (California Consumer Privacy Act) - US state privacy law
- HIPAA (Health Insurance Portability and Accountability Act) - US health data protection

{regulation_guidance}

ENHANCED ANALYSIS REQUIREMENTS:
1. Pattern Recognition: Identify data patterns (formats, structures, common values)
2. Risk Assessment: Evaluate potential risks of data exposure
3. Compliance Mapping: Map to specific regulation articles/requirements
4. Recommendations: Provide actionable security and handling recommendations
5. Explanation: Provide clear reasoning for classification decision

RESPONSE FORMAT (JSON only):
{{
    "column_name": "{column_name}",
    "classification_level": "Top Secret|Confidential|Internal|Public",
    "regulation": "NDMO|PDPL|GDPR|NCA|DAMA|CCPA|HIPAA",
    "justification": "Detailed explanation referencing specific regulation articles and requirements",
    "confidence_score": 0.95,
    "risk_score": 0.85,
    "patterns_identified": ["pattern1", "pattern2"],
    "compliance_requirements": ["requirement1", "requirement2"],
    "recommendations": ["recommendation1", "recommendation2"],
    "explanation": "Step-by-step reasoning for the classification decision",
    "compliance_notes": ["note1", "note2"],
    "data_handling_requirements": ["requirement1", "requirement2"]
}}

IMPORTANT GUIDELINES:
- Saudi National ID (10 digits starting with 1 or 2): Top Secret, PDPL
- Saudi phone numbers (05xxxxxxxx, +966xxxxxxxxx): Confidential, PDPL
- Email addresses: Confidential, GDPR/PDPL
- IBAN numbers (SA followed by 22 digits): Top Secret, PDPL
- Medical/health data: Top Secret, PDPL/HIPAA
- Biometric data: Top Secret, GDPR Article 9
- IP addresses: Internal, GDPR
- Names: Confidential, GDPR/PDPL
- Financial data: Top Secret, PDPL/PCI-DSS
- When in doubt, choose the more restrictive classification

Analyze the column data and provide comprehensive classification:
"""
        return prompt
    
    def _get_regulation_guidance(self, regulation: str) -> str:
        """Get specific guidance for regulation focus"""
        
        guidance_map = {
            "PDPL": """
PDPL FOCUS:
- Article 5: Special categories of personal data (biometric, health, genetic)
- Article 12: Consent requirements for personal data processing
- Article 14: Data subject rights and access controls
- Article 24: Data breach notification requirements
- Consider Saudi cultural and legal context
""",
            "GDPR": """
GDPR FOCUS:
- Article 4: Definition of personal data and special categories
- Article 9: Special categories requiring explicit consent
- Article 6: Lawful basis for processing
- Article 32: Security of processing requirements
- Consider EU privacy principles and data subject rights
""",
            "NDMO": """
NDMO FOCUS:
- Saudi national data governance framework
- Data sovereignty and localization requirements
- Government data classification standards
- Critical infrastructure data protection
- National security considerations
""",
            "HIPAA": """
HIPAA FOCUS:
- Protected Health Information (PHI) identification
- Administrative, physical, and technical safeguards
- Minimum necessary standard
- Business associate requirements
- Healthcare-specific privacy and security rules
"""
        }
        
        return guidance_map.get(regulation, "")
    
    def _validate_ai_response(
        self, 
        classification: Dict[str, Any], 
        column_name: str, 
        sample_values: List[Any]
    ) -> Dict[str, Any]:
        """Validate and normalize AI response"""
        
        # Required fields
        required_fields = [
            "classification_level", "regulation", "justification", "confidence_score"
        ]
        
        for field in required_fields:
            if field not in classification:
                raise AIServiceError(f"Missing required field: {field}")
        
        # Validate classification level
        valid_levels = ["Top Secret", "Confidential", "Internal", "Public"]
        if classification["classification_level"] not in valid_levels:
            logger.warning(f"Invalid classification level: {classification['classification_level']}")
            classification["classification_level"] = "Internal"
        
        # Validate regulation
        valid_regulations = settings.SUPPORTED_REGULATIONS
        if classification["regulation"] not in valid_regulations:
            logger.warning(f"Invalid regulation: {classification['regulation']}")
            classification["regulation"] = settings.DEFAULT_REGULATION
        
        # Validate confidence score
        try:
            confidence = float(classification["confidence_score"])
            classification["confidence_score"] = max(0.0, min(1.0, confidence))
        except (ValueError, TypeError):
            classification["confidence_score"] = 0.5
        
        # Ensure column name matches
        classification["column_name"] = column_name
        
        # Add default values for optional fields
        classification.setdefault("risk_score", 0.5)
        classification.setdefault("patterns_identified", [])
        classification.setdefault("recommendations", [])
        classification.setdefault("explanation", "")
        classification.setdefault("compliance_notes", [])
        classification.setdefault("data_handling_requirements", [])
        
        return classification
    
    async def _calculate_risk_score(
        self,
        ai_result: Dict[str, Any],
        detected_patterns: List[str],
        processed_data: Dict[str, Any]
    ) -> float:
        """Calculate comprehensive risk score"""
        
        base_risk = {
            "Top Secret": 0.9,
            "Confidential": 0.7,
            "Internal": 0.4,
            "Public": 0.1
        }.get(ai_result["classification_level"], 0.5)
        
        # Pattern-based risk adjustment
        pattern_risk = 0.0
        high_risk_patterns = [
            "national_id", "ssn", "credit_card", "iban", "biometric", 
            "medical", "financial", "password", "api_key"
        ]
        
        for pattern in detected_patterns:
            if any(hrp in pattern.lower() for hrp in high_risk_patterns):
                pattern_risk += 0.1
        
        # Data quality risk
        quality_risk = 0.0
        if processed_data.get("quality_score", 1.0) < 0.8:
            quality_risk = 0.1
        
        # Volume risk (more data = higher risk)
        volume_risk = min(0.1, len(processed_data.get("sample_values", [])) / 1000)
        
        # Combine risks
        total_risk = min(1.0, base_risk + pattern_risk + quality_risk + volume_risk)
        
        return round(total_risk, 2)
    
    def _create_fallback_result(
        self,
        column_name: str,
        sample_values: List[Any],
        options: ClassificationOptions
    ) -> ClassificationResult:
        """Create fallback classification result"""
        
        # Simple rule-based classification
        column_lower = column_name.lower()
        
        if any(keyword in column_lower for keyword in ['id', 'national', 'passport', 'ssn', 'iban']):
            classification_level = "Top Secret"
            regulation = "PDPL"
            justification = "Contains identification data requiring highest protection"
            risk_score = 0.9
        elif any(keyword in column_lower for keyword in ['phone', 'email', 'address', 'contact']):
            classification_level = "Confidential"
            regulation = "PDPL"
            justification = "Contains personal contact information requiring protection"
            risk_score = 0.7
        elif any(keyword in column_lower for keyword in ['name', 'birth', 'age', 'gender']):
            classification_level = "Confidential"
            regulation = "GDPR"
            justification = "Contains personal demographic data requiring protection"
            risk_score = 0.6
        else:
            classification_level = "Internal"
            regulation = "DAMA"
            justification = "General business data requiring internal access controls"
            risk_score = 0.4
        
        return ClassificationResult(
            column_name=column_name,
            classification_level=classification_level,
            regulation=regulation,
            justification=justification,
            confidence_score=0.5,
            risk_score=risk_score,
            sample_values=sample_values[:options.sample_size],
            patterns_detected=[],
            ai_provider="fallback",
            model_used="rule_based",
            processing_time=0.1,
            explanation="Fallback classification using rule-based approach",
            recommendations=["Review classification manually", "Consider AI re-classification"],
            compliance_notes=["Fallback classification - manual review recommended"]
        )
    
    def _convert_pre_classified_result(
        self,
        pre_classified: Dict[str, Any],
        options: ClassificationOptions
    ) -> ClassificationResult:
        """Convert pre-classified result to enhanced format"""
        
        return ClassificationResult(
            column_name=pre_classified["column_name"],
            classification_level=pre_classified["classification_level"],
            regulation=pre_classified["regulation"],
            justification=pre_classified["justification"],
            confidence_score=pre_classified.get("confidence_score", 0.95),
            risk_score=pre_classified.get("risk_score", 0.5),
            sample_values=pre_classified["sample_values"],
            patterns_detected=pre_classified.get("patterns_detected", []),
            ai_provider="rules_engine",
            model_used=pre_classified.get("rule_applied", "custom_rule"),
            processing_time=0.01,
            explanation=f"Matched custom rule: {pre_classified.get('rule_applied', 'unknown')}",
            recommendations=pre_classified.get("recommendations", []),
            compliance_notes=pre_classified.get("compliance_notes", [])
        )
    
    def _generate_cache_key(
        self,
        column_name: str,
        sample_values: List[Any],
        options: ClassificationOptions
    ) -> str:
        """Generate cache key for classification result"""
        
        import hashlib
        
        # Create hash of sample values
        sample_hash = hashlib.md5(
            str(sorted(sample_values[:options.sample_size])).encode()
        ).hexdigest()[:8]
        
        # Create options hash
        options_str = f"{options.ai_provider.value}_{options.confidence_threshold}_{options.language}_{options.regulation_focus}"
        options_hash = hashlib.md5(options_str.encode()).hexdigest()[:8]
        
        return f"classification:{column_name}:{sample_hash}:{options_hash}"
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check for classification service"""
        
        status = {"status": "healthy", "providers": {}}
        
        # Check each AI provider
        for provider in AIProvider:
            if provider == AIProvider.LOCAL_MODEL:
                continue
                
            try:
                config = self.model_configs[provider]
                client = self.clients[provider]
                
                # Simple health check request
                response = await client.get(
                    config["url"].replace("/chat/completions", "/models").replace("/messages", "/models"),
                    headers=config["headers"](),
                    timeout=5
                )
                
                status["providers"][provider.value] = {
                    "status": "healthy" if response.status_code == 200 else "unhealthy",
                    "response_time": response.elapsed.total_seconds()
                }
                
            except Exception as e:
                status["providers"][provider.value] = {
                    "status": "unhealthy",
                    "error": str(e)
                }
        
        # Overall status
        if any(p["status"] == "unhealthy" for p in status["providers"].values()):
            status["status"] = "degraded"
        
        return status
    
    async def get_available_models(self) -> Dict[str, List[str]]:
        """Get available models for each provider"""
        
        models = {}
        for provider, config in self.model_configs.items():
            models[provider.value] = config["models"]
        
        return models
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        for client in self.clients.values():
            await client.aclose()
