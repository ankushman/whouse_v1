#!/bin/bash
# Keep the dev server alive even when parent shell exits
cd /home/z/my-project

# Kill any existing instances
pkill -9 -f "next-server" 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null
sleep 1

# Start dev server in fully detached mode
exec setsid npx next dev -p 3000 --turbopack </dev/null >/tmp/nextdev.log 2>&1
