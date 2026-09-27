@echo off
REM ============================================================
REM  Los estados del agua - Ciencias
REM  Doble clic aqui para jugar. No necesita internet.
REM
REM  Como el juego de matematica, este NO fuerza Microsoft Edge:
REM  el contenido es visual, no auditivo, asi que sirve cualquier
REM  navegador moderno.
REM
REM  En iPhone esto NO funciona: iOS no ejecuta HTML guardados en
REM  el telefono. Para el celular se usa el enlace publicado.
REM ============================================================
cd /d "%~dp0"

REM --- Preparar el juego si hace falta (solo la primera vez) ---
if not exist "dist\index.html" (
  echo.
  echo   Preparando el juego por primera vez...
  echo.

  where npm >nul 2>nul
  if errorlevel 1 (
    echo   [ERROR] Falta Node.js en este equipo.
    echo   Instalalo desde https://nodejs.org y vuelve a intentar.
    echo.
    pause
    exit /b 1
  )

  if not exist "node_modules" call npm install
  call npm run build

  if not exist "dist\index.html" (
    echo.
    echo   [ERROR] No se pudo preparar el juego.
    pause
    exit /b 1
  )
)

start "" "%~dp0dist\index.html"
