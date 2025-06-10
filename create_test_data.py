#!/usr/bin/env python3
"""
Create a test Excel file for the Saudi Data Classification System
"""

import pandas as pd

def create_test_excel():
    """Create a test Excel file with various data types"""
    
    # Sample data with different sensitivity levels
    data = {
        # Top Secret data
        'National_ID': ['1234567890', '0987654321', '1122334455', '5566778899', '9988776655'],
        'Passport_Number': ['A12345678', 'B87654321', 'C11223344', 'D55667788', 'E99887766'],
        
        # Confidential data
        'Email': ['ahmed@example.com', 'fatima@example.com', 'mohammed@example.com', 'sara@example.com', 'omar@example.com'],
        'Phone': ['+966501234567', '+966509876543', '+966501122334', '+966505566778', '+966509988776'],
        'Address': ['Riyadh, Saudi Arabia', 'Jeddah, Saudi Arabia', 'Dammam, Saudi Arabia', 'Mecca, Saudi Arabia', 'Medina, Saudi Arabia'],
        
        # Restricted data
        'Full_Name': ['Ahmed Al-Rashid', 'Fatima Al-Zahra', 'Mohammed Al-Saud', 'Sara Al-Otaibi', 'Omar Al-Ghamdi'],
        'Birth_Date': ['1985-03-15', '1990-07-22', '1988-11-08', '1992-05-30', '1987-09-12'],
        'Salary': [5000, 4500, 6000, 5500, 4800],
        'Medical_Condition': ['Diabetes', 'Hypertension', 'None', 'Asthma', 'None'],
        
        # Public data
        'Department': ['IT', 'HR', 'Finance', 'Marketing', 'Operations'],
        'Job_Title': ['Software Engineer', 'HR Manager', 'Financial Analyst', 'Marketing Specialist', 'Operations Manager'],
        'Company': ['TechCorp', 'TechCorp', 'TechCorp', 'TechCorp', 'TechCorp'],
        'Office_Location': ['Building A', 'Building B', 'Building A', 'Building C', 'Building B'],
        'Employee_Status': ['Active', 'Active', 'Active', 'Active', 'Active']
    }
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Save to Excel file
    filename = 'test_data_saudi_classification.xlsx'
    df.to_excel(filename, index=False)
    
    print(f"✅ Created test Excel file: {filename}")
    print(f"📊 Contains {len(df.columns)} columns and {len(df)} rows")
    print("\nColumn types for testing:")
    print("🔴 Top Secret: National_ID, Passport_Number")
    print("🟠 Confidential: Email, Phone, Address")
    print("🟡 Restricted: Full_Name, Birth_Date, Salary, Medical_Condition")
    print("🔵 Public: Department, Job_Title, Company, Office_Location, Employee_Status")
    
    return filename

if __name__ == "__main__":
    create_test_excel()
