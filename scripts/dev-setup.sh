#!/bin/bash
# Development environment setup script

set -e  # Exit on error

echo "🚀 Task Manager - Development Setup"
echo "===================================="

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required. Current version: $(node -v)"
  exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo ""
  echo "📝 Creating .env file..."
  cp .env.example .env
  echo "✅ .env file created. Please review and update if needed."
else
  echo ""
  echo "✅ .env file already exists"
fi

# Create data directory for SQLite
echo ""
echo "📁 Creating data directory..."
mkdir -p data
echo "✅ Data directory created"

# Run type checking
echo ""
echo "🔍 Running type check..."
npm run type-check
echo "✅ Type check passed"

# Run linting
echo ""
echo "🧹 Running linter..."
npm run lint
echo "✅ Linting passed"

# Build the project
echo ""
echo "🏗️  Building project..."
npm run build
echo "✅ Build successful"

echo ""
echo "🎉 Development setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review .env configuration"
echo "  2. Run 'npm run dev' to start development servers"
echo "  3. Frontend: http://localhost:3000"
echo "  4. Backend: http://localhost:3001"
echo ""
