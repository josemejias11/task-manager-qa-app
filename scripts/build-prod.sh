#!/bin/bash
# Production build script with optimization

set -e

echo "🏭 Production Build"
echo "==================="

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
echo "✅ Clean complete"

# Run tests first
echo ""
echo "🧪 Running pre-build checks..."
npm run type-check
npm run lint
echo "✅ All checks passed"

# Set production environment
export NODE_ENV=production

# Build
echo ""
echo "🏗️  Building for production..."
npm run build

# Verify build
echo ""
echo "📊 Build Summary:"
echo "================="

if [ -d "dist/server" ]; then
  echo "📦 Server build: $(du -sh dist/server | cut -f1)"
else
  echo "❌ Server build failed!"
  exit 1
fi

if [ -d "dist/client" ]; then
  echo "📦 Client build: $(du -sh dist/client | cut -f1)"
  echo ""
  echo "📁 Client assets:"
  ls -lh dist/client/assets/ | grep -E '\.(js|css)$'
else
  echo "❌ Client build failed!"
  exit 1
fi

echo ""
echo "✅ Production build complete!"
echo ""
echo "💡 To start the production server:"
echo "   NODE_ENV=production npm start"
