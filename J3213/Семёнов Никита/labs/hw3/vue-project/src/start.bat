:: =======================================================
:: npm install -g json-server
:: json-server --watch db.json --port 3000
:: =======================================================

@echo off
title Сервер API
color 0A

echo Переход в папку проекта...
cd /d "%~dp0"

echo.
echo Запуск мокового сервера json-server на порту 3000...
echo.

json-server --watch db.json --port 3000

pause