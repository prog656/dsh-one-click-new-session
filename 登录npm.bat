@echo off
set "REPO=C:\Users\fanzejun\WorkBuddy\2026-11-13-19-09-02\dsh-one-click-new-session"
cd /d "%REPO%"
if not exist "%REPO%\setup-npm.mjs" (
  echo 找不到项目目录，请确认路径: %REPO%
  pause
  exit /b 1
)

echo ==================================================
echo   1/2  配置代理
echo ==================================================
node "%REPO%\setup-npm.mjs"
if errorlevel 1 (
  echo.
  echo 代理没配置成功，截图发我。
  pause
  exit /b 1
)

echo.
echo ==================================================
echo   2/2  登录 npm
echo.
echo   窗口会出现 Login at: https://... 的网址
echo   按一下回车，Edge 会打开授权页
echo   在网页上点绿色 Authorize
echo.
echo   ！！等窗口自己打印 "Logged in as prog656" 再关！！
echo ==================================================
call npm login --auth-type=web --registry=https://registry.npmjs.org/

echo.
echo ==================================================
echo   验证结果（下面应打印 prog656）
echo ==================================================
call npm whoami

echo.
echo 完成。回我一声即可。
pause
