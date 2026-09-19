@echo off
setlocal EnableExtensions
title Сервер API
color 0A

cd /d "%~dp0"

echo Проверка порта 3000...
for /f "usebackq tokens=5" %%P in (`netstat -ano ^| findstr :3000`) do (
    if not "%%P"=="" (
        echo Освобождаю порт 3000...
        taskkill /PID %%P /F >nul 2>&1
    )
)

echo.
echo Запуск мокового сервера json-server-auth на 127.0.0.1:3000...
echo.

node .\node_modules\json-server-auth\dist\bin.js db.json --host 127.0.0.1 --port 3000

pause