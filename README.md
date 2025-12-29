# Gerenciador de Restaurante (PDV) / Restaurant Manager (POS)

**🚀 Deploy:** https://github.com/MikhaelGois/pdv

Selecione o idioma / Select language:
[Português](#português) | [English](#english)

---

## <a id="português"></a>Português

Sistema completo de Ponto de Venda (PDV) para restaurantes, composto por uma interface de caixa, interface para garçons, um backend em NestJS e um protótipo frontend em Next.js.

### ⚡ Início Rápido

**Versão Web (Mais Fácil):**
1. Abra `index.html` no navegador (Interface do Caixa)
2. Abra `garcom.html` no navegador (Interface do Garçom)
3. Pronto! ✅

**Criar Instaladores:**
```powershell
# Execute o script interativo
.\criar-instaladores.ps1

# Ou veja instruções detalhadas em:
README_INSTALADORES.md
```

### 🚀 Funcionalidades

#### 🖥️ Frente de Caixa (Web Estática)
A interface principal para operação do restaurante (`index.html`).
- **Gestão de Pedidos**: Adição de produtos, observações (ex: "sem cebola"), seleção de mesa e comanda.
- **Pagamentos**:
  - Múltiplos métodos: Pix, Cartão, Dinheiro.
  - Cálculo automático de troco.
  - Aplicação de descontos (Valor fixo ou Porcentagem).
  - Taxa de serviço (10%) configurável (Manual ou Automática).
- **Controle de Caixa**:
  - Abertura e Fechamento de caixa com saldo inicial.
  - Relatório de fechamento com totais por método de pagamento e categorias.
  - Histórico de sessões (Login/Logout) de operadores.
- **Impressão**:
  - Comprovante não fiscal.
  - Conferência de conta (pré-pagamento).
  - Relatórios gerenciais.
- **Gestão de Produtos**: Cadastro e edição rápida de produtos e categorias.
- **Integração**: Recebimento de pedidos enviados pelos garçons em tempo real (via `localStorage`).

#### 📱 Área do Garçom (Web Estática)
Interface simplificada para dispositivos móveis (`garcom.html`).
- **Lançamento de Pedidos**: Seleção rápida de produtos por categoria.
- **Identificação**: Login do garçom para registro no pedido.
- **Envio**: Disparo do pedido para a fila do Caixa.

#### 🔙 Backend (NestJS)
API estruturada para gerenciar as regras de negócio (em desenvolvimento).
- Módulos: Vendas, Pagamentos e Fiscal (NFC-e simulada).
- Arquitetura modular e escalável.

#### ⚛️ Frontend (Next.js)
Protótipo de uma interface moderna em React/Next.js para futuras evoluções do sistema.

### 🛠️ Tecnologias Utilizadas

- **Frontend Estático**: HTML5, CSS3, JavaScript (Vanilla), Chart.js.
- **Backend**: Node.js, NestJS, TypeScript.
- **Frontend Moderno**: React, Next.js.
- **Persistência (Estático)**: LocalStorage e SessionStorage (navegador).

### ▶️ Como Rodar

#### 1. Versão Estática (Recomendada para Testes Imediatos)
Não requer instalação. Basta abrir os arquivos no navegador:
- **Caixa**: Abra o arquivo `index.html`.
- **Garçom**: Abra o arquivo `garcom.html`.

*Nota: Para que o Garçom e o Caixa compartilhem dados em tempo real, eles devem ser abertos no mesmo navegador (devido ao uso do LocalStorage).*

#### 2. Backend (API)
Certifique-se de ter o Node.js instalado.
```bash
cd backend
npm install
npm run start:dev
```
O servidor iniciará em `http://localhost:3000`.

### 3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Acesse a aplicação em `http://localhost:3001` (ou a porta indicada no terminal).

## 📂 Estrutura do Projeto

- `/`: Arquivos da versão estática (HTML/JS/CSS).
- `/backend`: Código fonte da API NestJS.
- `/frontend`: Código fonte da aplicação Next.js.

---
Desenvolvido por MikhaelGois