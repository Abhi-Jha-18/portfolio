@echo off
REM Cross-check: prefers a real local server (so fetch(), fonts and
REM relative asset paths behave exactly as they do in production).
REM Falls back to opening the file directly if Node is unavailable.

where npx >nul 2>nul
if %errorlevel%==0 (
  echo Starting portfolio preview on http://localhost:3000 ...
  echo Press Ctrl+C to stop.
  start "" "http://localhost:3000"
  npx --yes serve@14 -l 3000 .
) else (
  echo Node.js not found - opening index.html directly.
  echo Note: some features behave differently over file://
  start "" "index.html"
)
