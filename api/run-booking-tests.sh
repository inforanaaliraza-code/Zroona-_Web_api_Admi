#!/bin/bash

# Booking Flow Test Runner Script
# This script runs the booking flow tests

echo "🚀 Starting Booking Flow Tests..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if API server is running
echo "📡 Checking if API server is running..."
if curl -s http://localhost:3434/health > /dev/null 2>&1; then
    echo "✅ API server is running"
else
    echo "⚠️  API server might not be running. Starting tests anyway..."
fi

# Run the test script
echo ""
echo "🧪 Running tests..."
echo ""

node test-booking-flow.js

# Capture exit code
EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed. Check the output above for details."
fi

exit $EXIT_CODE

