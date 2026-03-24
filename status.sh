#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f ai-tools.pid ]; then
  echo "Server is not running (no PID file)."
  exit 1
fi

PID=$(cat ai-tools.pid)

if kill -0 "$PID" 2>/dev/null; then
  echo "Server is running (PID $PID)."
  exit 0
else
  echo "Server is not running (stale PID file). Cleaning up."
  rm -f ai-tools.pid
  exit 1
fi
