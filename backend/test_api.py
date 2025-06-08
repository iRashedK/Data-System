"""
Simple test script to verify the API is working
"""
import requests
import json

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Health check: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_upload():
    """Test file upload with a sample Excel file"""
    try:
        # Create a simple test Excel file
        import pandas as pd
        import io
        
        # Sample data
        data = {
            'Name': ['Ahmed Al-Rashid', 'Fatima Al-Zahra', 'Mohammed Al-Saud'],
            'National_ID': ['1234567890', '0987654321', '1122334455'],
            'Email': ['ahmed@example.com', 'fatima@example.com', 'mohammed@example.com'],
            'Phone': ['+966501234567', '+966509876543', '+966501122334'],
            'Department': ['IT', 'HR', 'Finance'],
            'Salary': [5000, 4500, 6000]
        }
        
        df = pd.DataFrame(data)
        
        # Save to bytes
        excel_buffer = io.BytesIO()
        df.to_excel(excel_buffer, index=False)
        excel_buffer.seek(0)
        
        # Upload file
        files = {'file': ('test_data.xlsx', excel_buffer.getvalue(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
        response = requests.post("http://localhost:8000/upload", files=files)
        
        print(f"Upload test: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Results: {json.dumps(result, indent=2)}")
        else:
            print(f"Error: {response.text}")
            
        return response.status_code == 200
        
    except Exception as e:
        print(f"Upload test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Saudi Data Classification API...")
    
    if test_health():
        print("✅ Health check passed")
    else:
        print("❌ Health check failed")
        exit(1)
    
    if test_upload():
        print("✅ Upload test passed")
    else:
        print("❌ Upload test failed")
        exit(1)
    
    print("🎉 All tests passed!")
