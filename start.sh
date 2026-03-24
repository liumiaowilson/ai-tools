#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if [ -f ai-tools.pid ] && kill -0 "$(cat ai-tools.pid)" 2>/dev/null; then
  echo "Server is already running (PID $(cat ai-tools.pid))"
  exit 1
fi

echo "Building..."
npm run build --silent

echo "Starting server on port 1234..."
PORT=1234 node dist/index.js >> ai-tools.log 2>&1 &
echo $! > ai-tools.pid

echo "Server started (PID $!) — logs: ai-tools.log"
