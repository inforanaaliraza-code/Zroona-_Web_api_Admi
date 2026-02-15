#!/bin/bash
# Kill processes using port 3000
PORT=${1:-3000}
PIDS=$(lsof -ti:$PORT)

if [ -z "$PIDS" ]; then
    echo "No processes found on port $PORT"
    exit 0
fi

echo "Killing processes on port $PORT: $PIDS"
for PID in $PIDS; do
    # Get the command name for logging
    COMMAND=$(ps -p $PID -o comm= 2>/dev/null || echo "unknown")
    echo "Killing process $PID (command: $COMMAND)..."
    
    # Try graceful kill first
    kill $PID 2>/dev/null
    sleep 0.5
    
    # Force kill if still running
    if kill -0 $PID 2>/dev/null; then
        kill -9 $PID 2>/dev/null
        echo "Force killed process $PID"
    else
        echo "Killed process $PID"
    fi
done

# Wait a moment for the port to be released
sleep 1

# Verify port is free
REMAINING=$(lsof -ti:$PORT 2>/dev/null)
if [ -n "$REMAINING" ]; then
    echo "Warning: Port $PORT may still be in use by: $REMAINING"
    exit 1
else
    echo "Port $PORT is now free"
    exit 0
fi
