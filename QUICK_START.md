# Quick Start Guide
## Step 0: Configure Environment

Copy the sample environment file and edit your settings:
```bash
cp .env.example .env
# open .env in your editor to add API keys and secrets
```


## Step 1: Start the Backend

Open a terminal and run:

\`\`\`bash
cd backend
python backend-standalone.py
\`\`\`

You should see:
\`\`\`
🚀 Starting Saudi Data Classification Backend...
📊 API will be available at: http://localhost:8000
📚 API Documentation: http://localhost:8000/docs
🔧 Health Check: http://localhost:8000/health
\`\`\`

## Step 2: Test Backend Connection

Open your browser and go to: http://localhost:8000/health

You should see:
\`\`\`json
{
  "status": "healthy",
  "api_version": "1.0.0",
  "message": "Backend is running successfully"
}
\`\`\`

## Step 3: Start the Frontend

Open a new terminal and run:

\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

## Step 4: Test the Application

1. Go to http://localhost:3000
2. You should see a green "✅ Backend Status: connected" message
3. Upload an Excel file to test the classification

## Troubleshooting

### "Failed to fetch" Error
- Make sure the backend is running on port 8000
- Check the connection status indicator in the UI
- Try refreshing the backend connection

### Backend Won't Start
- Make sure you have Python 3.7+ installed
- Install required packages: `pip install fastapi uvicorn pandas openpyxl`

### Frontend Won't Start
- Make sure you have Node.js installed
- Run `npm install` in the frontend directory
- Check for any error messages in the terminal
\`\`\`

Let me also create a simple test Excel file generator:
