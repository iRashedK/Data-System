# 🚀 Deployment Guide

## 📋 Files That Should Be in GitHub

### ✅ **Files to Commit:**
- `package.json` - Dependencies and scripts
- `.env.example` - Template for environment variables
- `SETUP.md` - Setup instructions
- `README.md` - Project documentation
- `docker-compose.yml` - Container orchestration
- All source code files (`app/`, `backend/`, etc.)
- `.gitignore` - File exclusion rules

### ❌ **Files NOT to Commit (Security):**
- `.env` - Contains sensitive API keys and secrets
- `node_modules/` - Dependencies (installed via npm)
- Database files (`.db`, `.sqlite`)
- Log files
- Build artifacts

## 🔧 **Setting Up on New Environment**

When someone clones your repository, they need to:

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/yourusername/data-classification-system.git
   cd data-classification-system
   \`\`\`

2. **Copy environment template:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. **Edit environment variables:**
   \`\`\`bash
   nano .env
   # Add your actual API keys and configuration
   \`\`\`

4. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

5. **Start the application:**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🔐 **Environment Variables Setup**

The `.env.example` file shows what variables are needed, but you must:

1. **Get your OpenRouter API key** from https://openrouter.ai
2. **Replace placeholder values** with real ones
3. **Never commit the actual `.env` file**

## 🌐 **Production Deployment**

### **Option 1: Vercel (Recommended for Frontend)**
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### **Option 2: Docker**
\`\`\`bash
# Build and run with Docker Compose
docker-compose up --build
\`\`\`

### **Option 3: Traditional Server**
1. Clone repository on server
2. Set up `.env` file with production values
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Start: `npm start`

## 📊 **Environment Variables Explained**

| Variable | Purpose | Example |
|----------|---------|---------|
| `OPENROUTER_API_KEY` | AI classification | `sk-or-v1-...` |
| `DATABASE_URL` | Database connection | `postgresql://...` |
| `JWT_SECRET` | Authentication | `your-secret-key` |
| `REDIS_URL` | Caching | `redis://localhost:6379` |

## 🔄 **Git Workflow**

\`\`\`bash
# Check what will be committed
git status

# Add files (this will respect .gitignore)
git add .

# Commit changes
git commit -m "Add new features"

# Push to GitHub
git push origin main
\`\`\`

## ⚠️ **Security Best Practices**

1. **Never commit `.env` files**
2. **Use different secrets for production**
3. **Rotate API keys regularly**
4. **Use environment-specific configurations**
5. **Enable GitHub security alerts**

## 🆘 **Troubleshooting**

### **If you accidentally committed `.env`:**
\`\`\`bash
# Remove from tracking
git rm --cached .env

# Add to .gitignore if not already there
echo ".env" >> .gitignore

# Commit the removal
git commit -m "Remove .env from tracking"

# Push changes
git push origin main
\`\`\`

### **If environment variables aren't working:**
1. Check `.env` file exists in project root
2. Verify variable names match exactly
3. Restart the development server
4. Check for typos in variable names
