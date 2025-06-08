# Setup Guide

This document provides detailed instructions for setting up the Data Classification System.

## Environment Setup

1. **Clone the repository**:
   \`\`\`bash
   git clone https://github.com/iRashedK/Data-System.git
   cd Data-System
   \`\`\`

2. **Set up environment variables**:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Edit the `.env` file to add your OpenRouter API key and other configuration options.

3. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

4. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

## Configuration Options

### Database

By default, the system uses SQLite for development. For production, configure PostgreSQL:

\`\`\`
DATABASE_URL=postgresql://username:password@localhost:5432/data_classifier
\`\`\`

### OpenRouter API

Sign up at [OpenRouter](https://openrouter.ai) to get your API key, then add it to your `.env` file:

\`\`\`
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
\`\`\`

### Security

For production, change the JWT secret:

\`\`\`
JWT_SECRET=your-super-secure-random-string
\`\`\`

## Running in Production

For production deployment:

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Start the production server:
   \`\`\`bash
   npm start
   \`\`\`

## Docker Deployment

You can also use Docker for deployment:

\`\`\`bash
docker-compose up -d
\`\`\`

This will start all required services (frontend, backend, database, Redis).
\`\`\`

Let's create a basic package.json:
