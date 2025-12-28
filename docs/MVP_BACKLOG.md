# MVP Backlog - Sistema de Gestão de Restaurante

Este documento detalha os Épicos e Histórias de Usuário para a construção do Produto Mínimo Viável (MVP).

---

### Épico 1: Gestão de Vendas e PDV (Ponto de Venda)

**Objetivo:** Permitir que o operador de caixa realize e gerencie vendas de forma eficiente no balcão.

- **História 1.1: Iniciar e Montar uma Venda**
  - **Como um** operador de caixa, **eu quero** iniciar uma nova venda, adicionando itens a partir de um catálogo de produtos, **para** registrar o consumo do cliente.
  - **Critérios de Aceite:**
    - A tela principal do PDV deve exibir as categorias de produtos.
    - Deve haver uma função de busca para encontrar produtos por nome.
    - Clicar em um produto deve adicioná-lo à lista da venda atual.
    - A lista de itens na venda deve mostrar nome, quantidade, preço unitário e o total do item.
    - O subtotal e o total da venda devem ser atualizados em tempo real.

- **História 1.2: Customizar Itens com Modificadores**
  - **Como um** operador de caixa, **eu quero** aplicar modificadores a um item (ex: "sem cebola", "ponto da carne mal passado"), **para** customizar o pedido conforme a solicitação do cliente.
  - **Critérios de Aceite:**
    - Produtos configurados com modificadores devem exibir as opções disponíveis ao serem adicionados à venda.
    - Os modificadores selecionados devem ser exibidos abaixo do item principal na comanda.
    - Modificadores podem ter um custo adicional, que deve ser somado corretamente ao valor do item e ao total da venda.

---

### Épico 2: Processamento de Pagamentos (Gateway Stripe)

**Objetivo:** Integrar um sistema de pagamento seguro e moderno, começando com Pix via Stripe.

- **História 2.1: Selecionar Método de Pagamento Pix**
  - **Como um** operador de caixa, **eu quero** selecionar "Pix" como método de pagamento para fechar uma venda, **para** oferecer uma opção de pagamento rápida e de baixo custo.
  - **Critérios de Aceite:**
    - Ao clicar em "Pagar", a tela de seleção de métodos de pagamento deve ser exibida.
    - A tela deve mostrar o valor total da venda.
    - Selecionar a opção "Pix" deve avançar o fluxo para a tela de pagamento com QR Code.

- **História 2.2: Processar Pagamento com QR Code Pix**
  - **Como um** operador de caixa, **eu quero** apresentar um QR Code Pix dinâmico para o cliente e aguardar a confirmação do pagamento, **para** finalizar a transação financeira.
  - **Critérios de Aceite:**
    - O sistema deve gerar um QR Code único para a transação através da integração com a API da Stripe.
    - A tela deve exibir o QR Code e uma opção de "Copia e Cola" do código Pix.
    - O sistema deve monitorar o status do pagamento em tempo real (utilizando webhooks da Stripe).
    - Após a confirmação do pagamento pela Stripe, o sistema deve avançar automaticamente para a próxima etapa (resumo fiscal).
    - O sistema deve tratar falhas ou cancelamentos no pagamento.

---

### Épico 3: Emissão Fiscal (NFC-e para SP)

**Objetivo:** Garantir a conformidade fiscal do estabelecimento com a legislação de São Paulo, emitindo a NFC-e.

- **História 3.1: Configurar Dados Fiscais e Certificado Digital**
  - **Como um** administrador do sistema, **eu quero** configurar os dados fiscais da minha empresa e o certificado digital A1, **para** habilitar a emissão de NFC-e.
  - **Critérios de Aceite:**
    - Uma área de "Configurações" deve permitir a inserção de CNPJ, Inscrição Estadual, regime tributário, etc.
    - O sistema deve permitir o upload seguro do arquivo do certificado A1 (.pfx) e a inserção da sua senha.
    - O sistema deve armazenar o CSC (Código de Segurança do Contribuinte) para os ambientes de homologação and produção.
    - As credenciais devem ser armazenadas de forma segura (ex: usando um serviço de cofre de segredos).

- **História 3.2: Emitir NFC-e Pós-Pagamento**
  - **Como um** operador de caixa, **eu quero**, após um pagamento ser aprovado, emitir a Nota Fiscal de Consumidor Eletrônica (NFC-e), **para** cumprir com as obrigações fiscais.
  - **Critérios de Aceite:**
    - A tela de resumo da venda, exibida após o pagamento, deve ter um campo para inserir o CPF do consumidor (opcional).
    - Clicar no botão "Emitir NFC-e" deve acionar o serviço de emissão no backend.
    - O backend deve montar o XML da NFC-e, assiná-lo com o certificado digital e enviá-lo para o webservice da SEFAZ-SP para autorização.
    - O sistema deve fornecer feedback claro em caso de sucesso ou de rejeição pela SEFAZ, informando o motivo.

- **História 3.3: Disponibilizar o DANFE-NFCe ao Cliente**
  - **Como um** operador de caixa, **eu quero**, após a autorização da NFC-e, poder imprimir ou enviar o DANFE-NFCe por e-mail, **para** entregar o comprovante fiscal ao cliente.
  - **Critérios de Aceite:**
    - A tela de sucesso deve exibir a mensagem "NFC-e emitida com sucesso!".
    - Opções para "Imprimir DANFE" e "Enviar por E-mail" devem ser apresentadas.
    - A função de impressão deve gerar um documento formatado segundo o layout padrão do DANFE-NFCe, incluindo o QR Code para consulta na SEFAZ.
    - Um botão "Finalizar" ou "Nova Venda" deve preparar o sistema para a próxima transação.
