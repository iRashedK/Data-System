#!/bin/bash

echo "🚀 Starting Saudi Data Classification System..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your OPENROUTER_API_KEY"
fi

# Start backend
echo "🔧 Starting backend..."
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

echo "✅ System started!"
echo "📊 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
