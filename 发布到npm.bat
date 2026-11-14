@echo off
rem Works from the repo folder OR from the Desktop copy: resolve the repo first.
set "REPO=%~dp0"
if exist "%REPO%setup-npm.mjs" goto ready
set "REPO=C:\Users\fanzejun\WorkBuddy\2026-11-13-19-09-02\dsh-one-click-new-session\"
if exist "%REPO%setup-npm.mjs" goto ready
echo 找不到项目目录，请把本脚本放回 dsh-one-click-new-session 文件夹里再运行。
pause
exit /b 1

:ready
cd /d "%REPO%"
echo ==================================================
echo   第 1 步 / 共 3 步   自动配置代理
echo   你的代理端口每次启动都可能变，这里自动探测
echo ==================================================
node "%REPO%setup-npm.mjs"
if errorlevel 1 goto fail

echo.
echo ==================================================
echo   第 2 步 / 共 3 步   登录 npm
echo   按提示依次输入：
echo     Username : prog656
echo     Password : 你的 npm 密码（输入时不显示，正常）
echo     Email    : 注册用的邮箱
echo ==================================================
call npm login --auth-type=legacy --registry=https://registry.npmjs.org/
if errorlevel 1 goto fail

echo.
echo ==================================================
echo   第 3 步 / 共 3 步   发布
echo   如果提示 Enter OTP，输入手机上的 6 位码
echo ==================================================
cd /d "%REPO%src"
call npm publish --registry=https://registry.npmjs.org/
if errorlevel 1 goto fail

echo.
echo ==================================================
echo   发布成功
echo   https://www.npmjs.com/package/dsh-one-click-new-session
echo ==================================================
pause
exit /b 0

:fail
echo.
echo ==================================================
echo   出错了。把上面的红字截图发给我，别自己反复试。
echo ==================================================
pause
exit /b 1
