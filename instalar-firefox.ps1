# Script interactivo para instalar en Firefox
# Ejecuta: .\instalar-firefox.ps1

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "║        🦊 INSTALAR EXTENSIÓN EN FIREFOX 🦊              ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Elige una opción:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [1] 🚀 RÁPIDO - Carga temporal (30 segundos)" -ForegroundColor Green
Write-Host "      → Perfecto para probar ahora mismo" -ForegroundColor Gray
Write-Host "      → Se desinstala al cerrar Firefox" -ForegroundColor Gray
Write-Host ""
Write-Host "  [2] 🔧 DESARROLLO - Usar web-ext" -ForegroundColor Cyan
Write-Host "      → Abre Firefox automáticamente" -ForegroundColor Gray
Write-Host "      → Recarga automática de cambios" -ForegroundColor Gray
Write-Host ""
Write-Host "  [3] 📦 PRODUCCIÓN - Crear archivo .xpi" -ForegroundColor Magenta
Write-Host "      → Para distribución" -ForegroundColor Gray
Write-Host "      → Instalación permanente" -ForegroundColor Gray
Write-Host ""
Write-Host "  [4] ❌ Salir" -ForegroundColor Red
Write-Host ""

$opcion = Read-Host "Selecciona una opción (1-4)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "  MÉTODO 1: CARGA TEMPORAL" -ForegroundColor Cyan
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "📋 Sigue estos pasos:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  1️⃣  Abre Firefox" -ForegroundColor White
        Write-Host ""
        Write-Host "  2️⃣  En la barra de direcciones, escribe:" -ForegroundColor White
        Write-Host "      about:debugging#/runtime/this-firefox" -ForegroundColor Green
        Write-Host ""
        Write-Host "  3️⃣  Click en 'Cargar complemento temporal...'" -ForegroundColor White
        Write-Host ""
        Write-Host "  4️⃣  Navega a esta carpeta:" -ForegroundColor White
        Write-Host "      $PWD" -ForegroundColor Green
        Write-Host ""
        Write-Host "  5️⃣  Selecciona el archivo: manifest.json" -ForegroundColor White
        Write-Host ""
        Write-Host "  6️⃣  ¡Listo! 🎉" -ForegroundColor White
        Write-Host ""
        
        Write-Host "❓ ¿Quieres que abra Firefox y la página de debugging? (S/N)" -ForegroundColor Yellow
        $abrir = Read-Host
        
        if ($abrir -eq "S" -or $abrir -eq "s") {
            Write-Host ""
            Write-Host "🌐 Abriendo Firefox..." -ForegroundColor Green
            Start-Process "firefox.exe" "about:debugging#/runtime/this-firefox"
            Write-Host ""
            Write-Host "✅ Ahora sigue los pasos 3-5 arriba" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "📖 Más info: INSTALAR_EN_FIREFOX.md" -ForegroundColor Gray
    }
    
    "2" {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "  MÉTODO 2: WEB-EXT (DESARROLLO)" -ForegroundColor Cyan
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar si node_modules existe
        if (-not (Test-Path "node_modules")) {
            Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
            npm install
            
            if ($LASTEXITCODE -ne 0) {
                Write-Host ""
                Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
                Write-Host "   Asegúrate de tener Node.js instalado" -ForegroundColor Yellow
                Write-Host "   Descarga de: https://nodejs.org/" -ForegroundColor Yellow
                exit 1
            }
        } else {
            Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "🚀 Ejecutando extensión en Firefox..." -ForegroundColor Green
        Write-Host ""
        Write-Host "   → Firefox se abrirá automáticamente" -ForegroundColor Gray
        Write-Host "   → La extensión estará cargada" -ForegroundColor Gray
        Write-Host "   → Los cambios se recargan automáticamente" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   Presiona Ctrl+C para detener" -ForegroundColor Yellow
        Write-Host ""
        
        npm run firefox
    }
    
    "3" {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "  MÉTODO 3: CREAR PAQUETE .XPI" -ForegroundColor Cyan
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar si node_modules existe
        if (-not (Test-Path "node_modules")) {
            Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
            npm install
            
            if ($LASTEXITCODE -ne 0) {
                Write-Host ""
                Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
                exit 1
            }
        }
        
        Write-Host "🔨 Creando paquete .xpi..." -ForegroundColor Green
        npm run firefox:build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ ¡Paquete creado exitosamente!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📁 Ubicación:" -ForegroundColor Yellow
            
            $xpiFile = Get-ChildItem -Path "web-ext-artifacts" -Filter "*.zip" | Select-Object -First 1
            if ($xpiFile) {
                Write-Host "   $($xpiFile.FullName)" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "📋 Para instalar:" -ForegroundColor Yellow
                Write-Host "   1. Abre Firefox" -ForegroundColor White
                Write-Host "   2. Arrastra el archivo a Firefox" -ForegroundColor White
                Write-Host "   3. O ve a about:addons → ⚙️ → 'Install Add-on From File'" -ForegroundColor White
            }
        } else {
            Write-Host ""
            Write-Host "❌ Error al crear el paquete" -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host ""
        Write-Host "👋 ¡Hasta luego!" -ForegroundColor Yellow
        Write-Host ""
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Opción inválida" -ForegroundColor Red
        Write-Host ""
        exit 1
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
