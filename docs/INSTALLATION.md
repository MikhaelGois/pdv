# Instalação e Build (Mobile & Desktop)

## Workspaces

```bash
npm install --workspaces
```

## Backend

```bash
cd backend
npm install
npm run start:dev
```

## Mobile (Expo)

```bash
cd apps/mobile
npm install
npx expo start
```

## Desktop (Tauri)

Instale Rust (Windows: instale MSVC + `rustup`).

```bash
cd apps/desktop
npm install
npm run dev
npm run tauri:dev
```
