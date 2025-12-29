# 🚀 GUIA RÁPIDO - INSTALADORES

## ✅ Bugs Corrigidos
- ✅ **Garçom**: Produtos agora aparecem corretamente na interface
- ✅ **Caixa**: Modal de login fecha corretamente após entrar

## 📦 Instaladores Disponíveis

### 1️⃣ Windows Desktop (Tauri)

**Pré-requisitos:**
```powershell
# 1. Instalar Rust
# Baixe de: https://rustup.rs/
# Após instalar, execute:
rustup default stable

# 2. Visual Studio Build Tools (se não tiver Visual Studio)
# Baixe de: https://visualstudio.microsoft.com/downloads/
# Instale apenas "C++ Build Tools"
```

**Criar Instalador MSI:**
```powershell
cd apps\desktop
npm install
npm run tauri:build
```

**Resultado:** `apps\desktop\src-tauri\target\release\bundle\msi\PDV_0.1.0_x64.msi`

---

### 2️⃣ Android (Expo)

**Opção A - Build na Nuvem (Recomendado):**
```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login (criar conta gratuita em expo.dev)
eas login

# 3. Build
cd apps/mobile
eas build -p android --profile production

# O APK será gerado na nuvem e você receberá o link
```

**Opção B - Build Local:**
```bash
# Requer Android Studio instalado

cd apps/mobile
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleRelease

# APK em: android/app/build/outputs/apk/release/app-release.apk
```

---

### 3️⃣ iOS (Expo)

**Requer macOS com Xcode:**
```bash
cd apps/mobile
eas build -p ios --profile production
```

---

## 🌐 Versão Web (Sem Instalação)

A versão web funciona perfeitamente sem necessidade de instaladores:

1. **Interface do Caixa**: Abrir `index.html` no navegador
2. **Interface do Garçom**: Abrir `garcom.html` no navegador

Tudo funciona com localStorage, sem necessidade de backend.

---

## ⚡ Script Automático (Windows)

Execute o script interativo:
```powershell
.\criar-instaladores.ps1
```

Opções disponíveis:
1. Criar instalador Windows (Tauri Desktop)
2. Criar APK Android (Expo Mobile)
3. Testar versão web localmente
4. Configurar ambiente de desenvolvimento

---

## 🔧 Troubleshooting

### Erro: "Rust não encontrado"
```powershell
# Instale Rust
https://rustup.rs/

# Configure
rustup default stable
rustup target add x86_64-pc-windows-msvc
```

### Erro: "ANDROID_HOME não configurado"
```powershell
# 1. Instale Android Studio
# 2. Configure variáveis de ambiente:
$env:ANDROID_HOME = "C:\Users\SeuUsuario\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
```

### Erro: "tauri command not found"
```powershell
cd apps\desktop
npm install @tauri-apps/cli --save-dev
```

---

## 📍 Repositório GitHub

**URL:** https://github.com/MikhaelGois/pdv

```bash
git clone https://github.com/MikhaelGois/pdv.git
cd pdv
```

---

## 🎯 Próximos Passos

Após criar os instaladores:

1. **Teste o instalador** em uma máquina limpa
2. **Code Signing** (Windows): Adquira certificado para produção
3. **Publicação**:
   - Windows: Microsoft Store ou distribuição direta
   - Android: Google Play Store
   - iOS: Apple App Store

---

## 📞 Suporte

- GitHub Issues: https://github.com/MikhaelGois/pdv/issues
- Documentação Completa: `README_INSTALADORES.md`
