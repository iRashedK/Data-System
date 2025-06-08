# Data Classification System - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git

### 1. Clone and Setup
\`\`\`bash
git clone <your-repo-url>
cd data-classification-system
cp .env.example .env
\`\`\`

### 2. Configure Environment
Edit `.env` file and add your API keys:
\`\`\`bash
nano .env
\`\`\`

**Required Configuration:**
- `OPENROUTER_API_KEY`: Get from https://openrouter.ai/
- `JWT_SECRET`: Generate a secure random string
- `ENCRYPTION_KEY`: 32-character encryption key

### 3. Install Dependencies
\`\`\`bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
\`\`\`

### 4. Start Development Servers

**Option A: Start both servers separately**
\`\`\`bash
# Terminal 1 - Frontend (Next.js)
npm run dev

# Terminal 2 - Backend (FastAPI)
npm run backend-dev
\`\`\`

**Option B: Using Docker**
\`\`\`bash
npm run docker:up
\`\`\`

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Environment Variables

### Required
- `OPENROUTER_API_KEY`: AI classification service
- `JWT_SECRET`: Authentication security
- `ENCRYPTION_KEY`: Data encryption

### Optional
- `ANTHROPIC_API_KEY`: Alternative AI provider
- `OPENAI_API_KEY`: Alternative AI provider
- `DATABASE_URL`: PostgreSQL connection (defaults to SQLite)
- `REDIS_URL`: Caching service
- `SENTRY_DSN`: Error monitoring

## Features

### ✅ Core Features
- File upload and classification
- Saudi PDPL compliance
- Real-time dashboard
- Export functionality

### 🚀 Advanced Features
- AI-powered classification
- Multiple regulation support
- Open data generator
- Compliance reporting

## Troubleshooting

### Common Issues

1. **Missing API Key**
   \`\`\`
   Error: OPENROUTER_API_KEY not configured
   \`\`\`
   Solution: Add your OpenRouter API key to `.env`

2. **Port Already in Use**
   \`\`\`
   Error: Port 3000 is already in use
   \`\`\`
   Solution: Change PORT in `.env` or kill existing process

3. **Python Dependencies**
   \`\`\`
   Error: No module named 'fastapi'
   \`\`\`
   Solution: Install backend dependencies
   \`\`\`bash
   cd backend && pip install -r requirements.txt
   \`\`\`

### Getting API Keys

1. **OpenRouter** (Recommended)
   - Visit: https://openrouter.ai/
   - Sign up and get API key
   - Add to `.env`: `OPENROUTER_API_KEY=sk-or-v1-...`

2. **Anthropic** (Optional)
   - Visit: https://console.anthropic.com/
   - Get API key
   - Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

## Development

### Project Structure
\`\`\`
data-classification-system/
├── app/                    # Next.js frontend
├── backend/               # FastAPI backend
├── components/           # Shared components
├── .env                 # Environment variables
└── docker-compose.yml   # Docker configuration
\`\`\`

### Available Scripts
- `npm run dev`: Start frontend development server
- `npm run backend-dev`: Start backend development server
- `npm run build`: Build for production
- `npm run docker:up`: Start with Docker
- `npm run lint`: Run linting

## Production Deployment

### Using Docker
\`\`\`bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
\`\`\`

### Manual Deployment
1. Set `NODE_ENV=production` in `.env`
2. Configure production database
3. Build frontend: `npm run build`
4. Start services: `npm start` and `npm run backend`

## Support

For issues and questions:
1. Check this setup guide
2. Review error logs
3. Check environment configuration
4. Ensure all dependencies are installed

## Security Notes

- Never commit `.env` file to version control
- Use strong JWT secrets in production
- Configure proper CORS origins
- Enable HTTPS in production
- Regularly update dependencies
