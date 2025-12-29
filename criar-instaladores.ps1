# 🔧 Script para Criar Instaladores
# Execute este arquivo para criar os instaladores do sistema PDV

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CRIADOR DE INSTALADORES - PDV" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ROOT = $PSScriptRoot

# Função para verificar se o comando existe
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Menu
Write-Host "Escolha o que deseja fazer:" -ForegroundColor Green
Write-Host "1. Criar instalador Windows (Tauri Desktop)"
Write-Host "2. Criar APK Android (Expo Mobile)"
Write-Host "3. Testar versão web localmente"
Write-Host "4. Configurar ambiente de desenvolvimento"
Write-Host "5. Sair"
Write-Host ""

$choice = Read-Host "Digite o número da opção"

switch ($choice) {
    "1" {
        Write-Host "`n📦 Criando instalador Windows..." -ForegroundColor Cyan
        
        # Verificar Rust
        if (-not (Test-Command "cargo")) {
            Write-Host "❌ Rust não encontrado!" -ForegroundColor Red
            Write-Host "Instale Rust de: https://rustup.rs/" -ForegroundColor Yellow
            Write-Host "Depois execute: rustup default stable" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "✓ Rust encontrado" -ForegroundColor Green
        
        # Instalar dependências
        Write-Host "`nInstalando dependências do desktop..." -ForegroundColor Cyan
        Set-Location "$ROOT\apps\desktop"
        
        if (-not (Test-Path "node_modules")) {
            npm install
        }
        
        # Build
        Write-Host "`nCriando instalador (isso pode demorar alguns minutos)..." -ForegroundColor Cyan
        npm run tauri build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ Instalador criado com sucesso!" -ForegroundColor Green
            Write-Host "Localização: apps\desktop\src-tauri\target\release\bundle\msi\" -ForegroundColor Yellow
            
            # Abrir pasta
            $bundlePath = "$ROOT\apps\desktop\src-tauri\target\release\bundle\msi"
            if (Test-Path $bundlePath) {
                explorer $bundlePath
            }
        } else {
            Write-Host "`n❌ Erro ao criar instalador" -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host "`n📱 Criando APK Android..." -ForegroundColor Cyan
        
        # Verificar Node
        if (-not (Test-Command "node")) {
            Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
            Write-Host "Instale Node.js de: https://nodejs.org/" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "✓ Node.js encontrado" -ForegroundColor Green
        
        Set-Location "$ROOT\apps\mobile"
        
        # Instalar dependências
        if (-not (Test-Path "node_modules")) {
            Write-Host "`nInstalando dependências..." -ForegroundColor Cyan
            npm install
        }
        
        Write-Host "`nOpções de build Android:" -ForegroundColor Yellow
        Write-Host "A. Build na nuvem Expo (requer conta gratuita)"
        Write-Host "B. Build local (requer Android Studio)"
        Write-Host ""
        
        $buildChoice = Read-Host "Escolha (A/B)"
        
        if ($buildChoice -eq "A" -or $buildChoice -eq "a") {
            Write-Host "`nPara build na nuvem, você precisa:" -ForegroundColor Cyan
            Write-Host "1. Criar conta em: https://expo.dev/" -ForegroundColor Yellow
            Write-Host "2. Instalar EAS CLI: npm install -g eas-cli" -ForegroundColor Yellow
            Write-Host "3. Fazer login: eas login" -ForegroundColor Yellow
            Write-Host "4. Executar: eas build -p android" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "O APK será gerado na nuvem e você receberá o link para download." -ForegroundColor Green
            
        } elseif ($buildChoice -eq "B" -or $buildChoice -eq "b") {
            Write-Host "`nPreparando build local..." -ForegroundColor Cyan
            
            # Verificar Android SDK
            if (-not $env:ANDROID_HOME) {
                Write-Host "❌ Android SDK não configurado!" -ForegroundColor Red
                Write-Host "Instale Android Studio e configure ANDROID_HOME" -ForegroundColor Yellow
                exit 1
            }
            
            Write-Host "Gerando arquivos nativos..." -ForegroundColor Cyan
            npx expo prebuild --platform android
            
            Write-Host "`nBuildando APK..." -ForegroundColor Cyan
            Set-Location "android"
            .\gradlew assembleRelease
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "`n✅ APK criado com sucesso!" -ForegroundColor Green
                Write-Host "Localização: android\app\build\outputs\apk\release\" -ForegroundColor Yellow
                
                $apkPath = "$ROOT\apps\mobile\android\app\build\outputs\apk\release"
                if (Test-Path $apkPath) {
                    explorer $apkPath
                }
            }
        }
    }
    
    "3" {
        Write-Host "`n🌐 Testando versão web..." -ForegroundColor Cyan
        
        # Iniciar backend
        Write-Host "`nIniciando backend..." -ForegroundColor Cyan
        Set-Location "$ROOT\backend"
        
        if (-not (Test-Path "node_modules")) {
            Write-Host "Instalando dependências do backend..." -ForegroundColor Yellow
            npm install
        }
        
        # Verificar banco
        if (-not (Test-Path "prisma\dev.db")) {
            Write-Host "Configurando banco de dados..." -ForegroundColor Yellow
            npx prisma generate
            npx prisma migrate dev --name init
            npx ts-node prisma/seed.ts
        }
        
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT\backend'; npm run start:dev"
        
        Start-Sleep -Seconds 3
        
        # Abrir interfaces
        Write-Host "`nAbrindo interfaces..." -ForegroundColor Green
        Start-Process "$ROOT\index.html"
        Start-Process "$ROOT\garcom.html"
        
        Write-Host "`n✅ Aplicação web iniciada!" -ForegroundColor Green
        Write-Host "Backend: http://localhost:3000" -ForegroundColor Yellow
        Write-Host "Caixa: Aberto no navegador (index.html)" -ForegroundColor Yellow
        Write-Host "Garçom: Aberto no navegador (garcom.html)" -ForegroundColor Yellow
    }
    
    "4" {
        Write-Host "`n⚙️ Configurando ambiente..." -ForegroundColor Cyan
        
        # Instalar dependências globais
        Write-Host "`nInstalando ferramentas globais..." -ForegroundColor Yellow
        
        # Backend
        Write-Host "`n1/3 Configurando backend..." -ForegroundColor Cyan
        Set-Location "$ROOT\backend"
        npm install
        npx prisma generate
        
        # Desktop
        Write-Host "`n2/3 Configurando desktop..." -ForegroundColor Cyan
        Set-Location "$ROOT\apps\desktop"
        npm install
        
        # Mobile
        Write-Host "`n3/3 Configurando mobile..." -ForegroundColor Cyan
        Set-Location "$ROOT\apps\mobile"
        npm install
        
        Write-Host "`n✅ Ambiente configurado!" -ForegroundColor Green
        Write-Host "`nPróximos passos:" -ForegroundColor Yellow
        Write-Host "- Para Rust/Tauri: Instale de https://rustup.rs/" -ForegroundColor White
        Write-Host "- Para Android: Instale Android Studio" -ForegroundColor White
        Write-Host "- Para iOS: Requer macOS com Xcode" -ForegroundColor White
    }
    
    "5" {
        Write-Host "`nSaindo..." -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host "`n❌ Opção inválida!" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Read-Host "`nPressione ENTER para sair"
