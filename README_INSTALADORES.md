# 🍔 Sistema PDV para Restaurante

Sistema completo de Ponto de Venda (PDV) para restaurantes com interfaces separadas para **Caixa** e **Garçom**.

## 🚀 Deploy no GitHub

**Repositório:** https://github.com/MikhaelGois/pdv

---

## 📦 Versões Disponíveis

### 1. **Versão Web (HTML/JS)** - ✅ Pronto para Usar
- Interface do Caixa: `index.html`
- Interface do Garçom: `garcom.html`
- **Como usar:** Abrir os arquivos HTML diretamente no navegador

### 2. **Versão Desktop (Tauri)** - 📱 Windows/macOS/Linux
- Aplicativo nativo leve e rápido
- Caminho: `apps/desktop/`
- **Status:** Scaffolding criado, pronto para build

### 3. **Versão Mobile (Expo/React Native)** - 📱 Android/iOS
- App mobile para garçons
- Caminho: `apps/mobile/`
- **Status:** Scaffolding criado, pronto para build

### 4. **Backend API (NestJS)** - 🔧 Opcional
- API REST com autenticação JWT
- Banco de dados SQLite/PostgreSQL
- Caminho: `backend/`
- **Status:** ✅ Funcionando

---

## 🎯 Iniciar Rapidamente

### Opção 1: Usar Versão Web (Mais Rápido)

1. Abra `index.html` no navegador (Interface do Caixa)
2. Abra `garcom.html` no navegador (Interface do Garçom)
3. Pronto! Tudo funciona com localStorage

### Opção 2: Com Backend API

```bash
# 1. Instalar dependências do backend
cd backend
npm install

# 2. Configurar banco de dados
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts

# 3. Iniciar servidor
npm run start:dev

# 4. Abrir interfaces web
# Backend rodará em http://localhost:3000
```

---

## 🏗️ Criar Instaladores

### Windows (Tauri) - Desktop

```bash
# 1. Instalar Rust (se não tiver)
# Baixar de: https://rustup.rs/

# 2. Instalar dependências
cd apps/desktop
npm install

# 3. Criar instalador MSI
npm run tauri build

# Instalador estará em: apps/desktop/src-tauri/target/release/bundle/msi/
```

**Requisitos:**
- Rust toolchain instalado
- Windows 10+ com Build Tools do Visual Studio

---

### Android (Expo) - Mobile

```bash
# 1. Instalar Expo CLI
npm install -g eas-cli

# 2. Entrar na pasta mobile
cd apps/mobile
npm install

# 3. Iniciar em modo desenvolvimento
npx expo start

# 4. Para criar APK/AAB de produção
eas login
eas build -p android --profile production

# APK será gerado na nuvem do Expo
```

**Requisitos:**
- Node.js 18+
- Conta no Expo (gratuita)
- Para build local: Android Studio + SDK

**Alternativa - Build local APK:**
```bash
npx expo prebuild
cd android
./gradlew assembleRelease
# APK em: android/app/build/outputs/apk/release/
```

---

### iOS (Expo) - Mobile

```bash
# Requer macOS com Xcode instalado

cd apps/mobile
eas build -p ios --profile production
```

---

## 📋 Funcionalidades

### Interface do Caixa (`index.html`)
- ✅ Cadastro de produtos e categorias
- ✅ Pedidos com observações
- ✅ Desconto (valor ou %)
- ✅ Taxa de serviço (10%)
- ✅ Pagamentos (Pix, Cartão, Dinheiro)
- ✅ Troco calculado automaticamente
- ✅ CPF na nota
- ✅ Controle de caixa (abertura/fechamento)
- ✅ Relatórios e gráficos
- ✅ Exportação CSV
- ✅ Impressão de recibos
- ✅ Histórico de sessões
- ✅ Modo edição de produtos
- ✅ Idiomas (PT/EN)

### Interface do Garçom (`garcom.html`)
- ✅ Identificação do garçom
- ✅ Seleção de mesa/comanda
- ✅ Busca de produtos
- ✅ Filtro por categoria
- ✅ Observações nos itens
- ✅ Envio para o caixa

### Backend API (`backend/`)
- ✅ Autenticação JWT
- ✅ CRUD de vendas
- ✅ Confirmação de pagamentos
- ✅ Catálogo (categorias/produtos)
- ✅ Mock NFC-e
- ✅ CORS habilitado

---

## 🔑 Usuários Demo (Backend)

Ao rodar o seed, os seguintes usuários são criados:

| Usuário | Senha | Role  |
|---------|-------|-------|
| garcom  | 1234  | GARCOM|
| caixa   | 1234  | CAIXA |
| admin   | 1234  | ADMIN |

---

## 🛠️ Tecnologias

### Frontend Web
- HTML5 + Vanilla JavaScript
- Chart.js (gráficos)
- LocalStorage (persistência)

### Desktop (Tauri)
- TypeScript + React + Vite
- Tauri (Rust) - ~3MB binário

### Mobile (Expo)
- TypeScript + React Native
- Expo SDK

### Backend
- NestJS (Node.js + TypeScript)
- Prisma ORM
- SQLite (dev) / PostgreSQL (prod)
- JWT Authentication

---

## 📁 Estrutura do Projeto

```
.
├── index.html              # PDV Caixa (versão web)
├── garcom.html            # Interface Garçom (versão web)
├── script.js              # Lógica do caixa
├── garcom.js              # Lógica do garçom
├── style.css              # Estilos compartilhados
│
├── backend/               # API NestJS
│   ├── src/
│   │   ├── auth/         # Autenticação JWT
│   │   ├── catalog/      # Categorias e produtos
│   │   ├── vendas/       # Pedidos
│   │   ├── pagamentos/   # Pagamentos
│   │   └── fiscal/       # NFC-e (mock)
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
│
├── apps/
│   ├── desktop/          # App Tauri (Windows/Mac/Linux)
│   │   ├── src/
│   │   └── src-tauri/
│   └── mobile/           # App Expo (Android/iOS)
│       └── App.tsx
│
├── packages/
│   └── shared/           # Tipos e API client compartilhados
│
└── docs/
    └── INSTALLATION.md   # Guia detalhado
```

---

## 🚧 Próximos Passos

### Para Produção
- [ ] Trocar SQLite por PostgreSQL
- [ ] Hash de senhas com bcrypt
- [ ] Integração real NFC-e
- [ ] Impressora térmica
- [ ] Backup automático
- [ ] Analytics e dashboards
- [ ] Multi-estabelecimento

### Para Apps Nativos
- [ ] Finalizar UI do desktop
- [ ] Sincronização offline (mobile)
- [ ] Notificações push
- [ ] Code signing (certificados)
- [ ] Publicação nas stores

---

## 📞 Suporte

**GitHub:** https://github.com/MikhaelGois/pdv

---

## 📄 Licença

Projeto de código aberto para uso livre.
