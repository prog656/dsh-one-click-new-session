@echo off
chcp 65001 >nul
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install it from https://nodejs.org then run this again.
  pause
  exit /b 1
)
node "%~dp0install.mjs" --lang zh %*
echo.
pause
