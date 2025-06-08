"""
Custom rules engine for pattern-based classification
"""

import re
import logging
from typing import Dict, List, Any
from core.models import CustomRule

logger = logging.getLogger(__name__)

class RulesEngine:
    def __init__(self):
        self.built_in_rules = self._load_built_in_rules()
    
    def apply_rules(self, columns_data: Dict[str, List[Any]], custom_rules: List[CustomRule]) -> Dict[str, Dict[str, Any]]:
        """Apply custom and built-in rules to classify columns"""
        
        classified = {}
        
        for column_name, sample_values in columns_data.items():
            # Try custom rules first
            classification = self._apply_custom_rules(column_name, sample_values, custom_rules)
            
            if not classification:
                # Try built-in rules
                classification = self._apply_built_in_rules(column_name, sample_values)
            
            if classification:
                classified[column_name] = classification
        
        return classified
    
    def _apply_custom_rules(self, column_name: str, sample_values: List[Any], custom_rules: List[CustomRule]) -> Dict[str, Any]:
        """Apply user-defined custom rules"""
        
        for rule in custom_rules:
            if not rule.is_active:
                continue
            
            try:
                # Check if pattern matches column name or sample values
                if self._pattern_matches(rule.pattern, column_name, sample_values):
                    return {
                        "column_name": column_name,
                        "classification_level": rule.classification_level,
                        "regulation": rule.regulation,
                        "justification": f"Matched custom rule: {rule.name} - {rule.description}",
                        "confidence_score": 0.95,
                        "sample_values": sample_values[:5],
                        "rule_applied": rule.name
                    }
            except Exception as e:
                logger.error(f"Error applying custom rule {rule.name}: {str(e)}")
                continue
        
        return None
    
    def _apply_built_in_rules(self, column_name: str, sample_values: List[Any]) -> Dict[str, Any]:
        """Apply built-in classification rules"""
        
        for rule in self.built_in_rules:
            try:
                if self._pattern_matches(rule["pattern"], column_name, sample_values):
                    return {
                        "column_name": column_name,
                        "classification_level": rule["classification_level"],
                        "regulation": rule["regulation"],
                        "justification": rule["justification"],
                        "confidence_score": rule["confidence_score"],
                        "sample_values": sample_values[:5],
                        "rule_applied": rule["name"]
                    }
            except Exception as e:
                logger.error(f"Error applying built-in rule {rule['name']}: {str(e)}")
                continue
        
        return None
    
    def _pattern_matches(self, pattern: str, column_name: str, sample_values: List[Any]) -> bool:
        """Check if pattern matches column name or sample values"""
        
        try:
            # Check column name
            if re.search(pattern, column_name, re.IGNORECASE):
                return True
            
            # Check sample values
            for value in sample_values:
                if value is not None and re.search(pattern, str(value)):
                    return True
            
            return False
            
        except re.error as e:
            logger.error(f"Invalid regex pattern '{pattern}': {str(e)}")
            return False
    
    def _load_built_in_rules(self) -> List[Dict[str, Any]]:
        """Load built-in classification rules"""
        
        return [
            {
                "name": "Saudi National ID",
                "pattern": r"^[12]\d{9}$",
                "classification_level": "Top Secret",
                "regulation": "PDPL",
                "justification": "Saudi National ID numbers are highly sensitive personal identifiers protected under PDPL Article 5",
                "confidence_score": 0.98
            },
            {
                "name": "Saudi Phone Number",
                "pattern": r"^(05|966|00966)\d{8}$",
                "classification_level": "Confidential",
                "regulation": "PDPL",
                "justification": "Phone numbers are personal contact information requiring protection under PDPL Article 12",
                "confidence_score": 0.95
            },
            {
                "name": "Email Address",
                "pattern": r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
                "classification_level": "Confidential",
                "regulation": "GDPR",
                "justification": "Email addresses are personal data requiring protection under GDPR Article 4",
                "confidence_score": 0.95
            },
            {
                "name": "IBAN",
                "pattern": r"^SA\d{22}$",
                "classification_level": "Top Secret",
                "regulation": "PDPL",
                "justification": "IBAN numbers are financial identifiers requiring highest protection under PDPL",
                "confidence_score": 0.98
            },
            {
                "name": "Credit Card",
                "pattern": r"^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$",
                "classification_level": "Top Secret",
                "regulation": "PDPL",
                "justification": "Credit card numbers are financial data requiring highest protection",
                "confidence_score": 0.98
            },
            {
                "name": "IP Address",
                "pattern": r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
                "classification_level": "Internal",
                "regulation": "GDPR",
                "justification": "IP addresses can be personal data under GDPR requiring internal access controls",
                "confidence_score": 0.85
            },
            {
                "name": "Date of Birth",
                "pattern": r"(birth|dob|born)",
                "classification_level": "Confidential",
                "regulation": "GDPR",
                "justification": "Date of birth is personal data requiring protection under GDPR",
                "confidence_score": 0.90
            },
            {
                "name": "Salary/Income",
                "pattern": r"(salary|income|wage|pay)",
                "classification_level": "Confidential",
                "regulation": "PDPL",
                "justification": "Financial information requiring protection under employment data regulations",
                "confidence_score": 0.85
            },
            {
                "name": "Medical Data",
                "pattern": r"(medical|health|diagnosis|treatment|patient)",
                "classification_level": "Top Secret",
                "regulation": "PDPL",
                "justification": "Medical data is highly sensitive requiring maximum protection under health data regulations",
                "confidence_score": 0.95
            },
            {
                "name": "Biometric Data",
                "pattern": r"(fingerprint|biometric|facial|iris|retina)",
                "classification_level": "Top Secret",
                "regulation": "GDPR",
                "justification": "Biometric data is special category data under GDPR Article 9 requiring highest protection",
                "confidence_score": 0.98
            }
        ]
    
    def validate_rule(self, pattern: str) -> bool:
        """Validate a regex pattern"""
        try:
            re.compile(pattern)
            return True
        except re.error:
            return False
    
    def test_rule(self, pattern: str, test_values: List[str]) -> List[bool]:
        """Test a rule pattern against test values"""
        results = []
        try:
            compiled_pattern = re.compile(pattern, re.IGNORECASE)
            for value in test_values:
                results.append(bool(compiled_pattern.search(str(value))))
        except re.error:
            results = [False] * len(test_values)
        
        return results
