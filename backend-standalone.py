#!/usr/bin/env python3
"""
Standalone backend server for Saudi Data Classification System
Run this file directly: python backend-standalone.py
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import os
import json
import logging
from typing import List, Dict, Any
from pydantic import BaseModel
import uuid
from datetime import datetime
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Saudi Data Classification API",
    description="API for classifying Excel data according to Saudi regulations",
    version="1.0.0"
)

# Add CORS middleware - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClassificationResult(BaseModel):
    column: str
    classification: str
    justification: str

class ClassificationResponse(BaseModel):
    results: List[ClassificationResult]
    file_id: str
    timestamp: str

def classify_column_mock(column_name: str, sample_data: List[Any]) -> Dict[str, Any]:
    """
    Mock classification function for testing purposes
    """
    column_lower = column_name.lower()
    
    # Enhanced classification rules
    if any(keyword in column_lower for keyword in ['national_id', 'passport', 'ssn', 'iqama', 'civil_id']):
        classification = "Top Secret"
        justification = "Contains national identification data which is highly sensitive under Saudi PDPL and could threaten national security if disclosed."
    elif any(keyword in column_lower for keyword in ['phone', 'mobile', 'email', 'address', 'location', 'gps']):
        classification = "Confidential"
        justification = "Contains personal contact information requiring protection under Saudi PDPL regulations."
    elif any(keyword in column_lower for keyword in ['name', 'birth', 'age', 'gender', 'salary', 'medical', 'health']):
        classification = "Restricted"
        justification = "Contains personal demographic or sensitive business data requiring special handling under Saudi regulations."
    elif any(keyword in column_lower for keyword in ['password', 'pin', 'secret', 'key', 'token']):
        classification = "Top Secret"
        justification = "Contains authentication credentials that could compromise system security."
    else:
        classification = "Public"
        justification = "General business data that can be shared publicly without restrictions under Saudi regulations."
    
    return {
        "column": column_name,
        "classification": classification,
        "justification": justification
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Saudi Data Classification API", "status": "running"}

@app.get("/health")
async def health_check():
    """API health check endpoint"""
    return {"status": "healthy", "api_version": "1.0.0", "message": "Backend is running successfully"}

@app.post("/upload", response_model=ClassificationResponse)
async def upload_file(file: UploadFile = File(...)):
    """Upload an Excel file for classification"""
    
    # Validate file type
    if not file.filename or not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only Excel files (.xlsx, .xls) are supported")
    
    try:
        # Generate unique ID for this upload
        file_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        # Read file content
        file_content = await file.read()
        
        # Save file temporarily
        temp_filename = f"temp_{file_id}.xlsx"
        with open(temp_filename, "wb") as f:
            f.write(file_content)
        
        # Read Excel file
        try:
            df = pd.read_excel(temp_filename)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading Excel file: {str(e)}")
        
        results = []
        
        # Process each column
        for column in df.columns:
            # Get sample data (first 10 non-null values)
            sample_data = df[column].dropna().head(10).tolist()
            
            # Skip empty columns
            if not sample_data:
                continue
                
            # Classify the column using mock function
            classification = classify_column_mock(column, sample_data)
            results.append(ClassificationResult(**classification))
            
            logger.info(f"Classified column: {column} as {classification.get('classification')}")
        
        # Clean up temporary file
        try:
            os.remove(temp_filename)
        except:
            pass
        
        return ClassificationResponse(
            results=results,
            file_id=file_id,
            timestamp=timestamp
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting Saudi Data Classification Backend...")
    print("📊 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔧 Health Check: http://localhost:8000/health")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run(
        "backend-standalone:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
