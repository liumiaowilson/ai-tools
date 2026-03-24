#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f ai-tools.pid ]; then
  echo "No PID file found — server is not running."
  exit 0
fi

PID=$(cat ai-tools.pid)

if kill "$PID" 2>/dev/null; then
  rm -f ai-tools.pid
  echo "Server stopped (PID $PID)."
else
  rm -f ai-tools.pid
  echo "Process $PID was not running. Cleaned up PID file."
fi
