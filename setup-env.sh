#!/bin/bash

# AI Data Classification System - Environment Setup Script
# This script helps you set up your environment variables

echo "🚀 AI Data Classification System - Environment Setup"
echo "=================================================="

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ Error: .env.example file not found!"
    echo "Please make sure you're in the project root directory."
    exit 1
fi

# Copy .env.example to .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📋 Copying .env.example to .env..."
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo "✅ Overwritten .env file"
    else
        echo "📝 Keeping existing .env file"
    fi
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Edit the .env file with your actual values:"
echo "   - Get OpenRouter API key from: https://openrouter.ai/"
echo "   - Change JWT_SECRET to a secure random string"
echo "   - Update ENCRYPTION_KEY (must be 32 characters)"
echo ""
echo "2. Install dependencies:"
echo "   npm install"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "📖 For detailed setup instructions, see SETUP.md"
