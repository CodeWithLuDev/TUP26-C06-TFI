@echo off
title Mundial 26 - Simulador de Torneo
color 0A
cls

echo.
echo  ================================================
echo   MUNDIAL 26 - Simulador de Torneo (TFI)
echo  ================================================
echo.
echo  Iniciando servidor local...
echo.

:: Intentar con npx serve primero
where npx >nul 2>&1
if %errorlevel% == 0 (
    echo  Servidor: npx serve
    echo  URL:      http://localhost:3000
    echo.
    echo  Presiona Ctrl+C para detener el servidor.
    echo  ================================================
    echo.
    start "" "http://localhost:3000"
    npx serve .
    goto :fin
)

:: Si no hay npx, intentar con Python (viene preinstalado en Windows 11)
where python >nul 2>&1
if %errorlevel% == 0 (
    echo  Servidor: Python http.server
    echo  URL:      http://localhost:8000
    echo.
    echo  Presiona Ctrl+C para detener el servidor.
    echo  ================================================
    echo.
    start "" "http://localhost:8000"
    python -m http.server 8000
    goto :fin
)

:: Ninguno disponible
echo  ERROR: No se encontro ningun servidor disponible.
echo.
echo  Opciones:
echo    1. Instala Node.js desde https://nodejs.org
echo    2. Usa la extension "Live Server" en VS Code
echo.
pause

:fin