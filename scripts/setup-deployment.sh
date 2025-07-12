#!/bin/bash

# Quick setup script for deployment
echo "🚀 Setting up deployment configuration..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please fill in your environment variables."
else
    echo "✅ .env.local already exists."
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git repository initialized."
fi

# Check if GitHub remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository as remote:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
else
    echo "✅ Git remote already configured."
fi

echo ""
echo "🎯 Next steps:"
echo "1. Fill in your environment variables in .env.local"
echo "2. Set up GitHub Secrets (see DEPLOYMENT.md)"
echo "3. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add deployment configuration'"
echo "   git push -u origin main"
echo ""
echo "📚 For detailed instructions, check DEPLOYMENT.md"
