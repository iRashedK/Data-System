## 🚀 Quick Start

### 1. Clone and Setup Environment

\`\`\`bash
# Clone the repository
git clone https://github.com/iRashedK/Data-System.git
cd Data-System

# Copy environment template
cp .env.example .env

# Edit the environment file with your settings
nano .env  # or use your preferred editor
\`\`\`

### 2. Required Environment Variables

**Minimum required setup:**
- `OPENROUTER_API_KEY` - Get from https://openrouter.ai/
- `JWT_SECRET` - Change to a secure random string
- `ENCRYPTION_KEY` - Must be exactly 32 characters

**For local development, you can use the default database settings.**
