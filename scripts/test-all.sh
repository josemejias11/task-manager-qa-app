#!/bin/bash
# Comprehensive testing script

set -e

echo "🧪 Running All Tests"
echo "===================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

FAILED=0

# Type checking
echo ""
echo "📝 Type Checking..."
if npm run type-check; then
  echo -e "${GREEN}✅ Type check passed${NC}"
else
  echo -e "${RED}❌ Type check failed${NC}"
  FAILED=1
fi

# Linting
echo ""
echo "🧹 Linting..."
if npm run lint; then
  echo -e "${GREEN}✅ Linting passed${NC}"
else
  echo -e "${RED}❌ Linting failed${NC}"
  FAILED=1
fi

# Build test
echo ""
echo "🏗️  Build Test..."
if npm run build; then
  echo -e "${GREEN}✅ Build successful${NC}"
else
  echo -e "${RED}❌ Build failed${NC}"
  FAILED=1
fi

# TODO: Add unit tests when implemented
# echo ""
# echo "🔬 Unit Tests..."
# if npm test; then
#   echo -e "${GREEN}✅ Unit tests passed${NC}"
# else
#   echo -e "${RED}❌ Unit tests failed${NC}"
#   FAILED=1
# fi

# Summary
echo ""
echo "===================="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi
