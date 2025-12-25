#!/bin/bash
# Bash script to clear Next.js cache
# Run this script if you get ChunkLoadError

echo "Clearing Next.js build cache..."

# Remove .next folder
if [ -d ".next" ]; then
    rm -rf .next
    echo "✓ Removed .next folder"
else
    echo "⚠ .next folder not found"
fi

# Remove node_modules cache
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✓ Removed node_modules/.cache"
else
    echo "⚠ node_modules/.cache not found"
fi

echo ""
echo "Cache cleared! Now run: npm run dev"

