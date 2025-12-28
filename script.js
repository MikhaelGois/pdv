document.addEventListener('DOMContentLoaded', () => {
    // ----------------- STATE MANAGEMENT -----------------
    const state = {
        products: [],
        categories: [],
        currentOrder: {
            id: null,
            tableId: null,
            items: [], // { productId, name, price, quantity }
            subtotal: 0,
            total: 0,
            waiterName: '' // Armazena o nome do garçom se vier de um pedido
        },
        cashRegister: {
            isOpen: false,
            openingBalance: 0,
            transactions: [] // { id, time, total, method }
        },
        activeCategoryId: null,
        isEditMode: false,
        cashierName: '',
        loginTime: null,
        hasTip: false, // Estado para controlar a gorjeta
        payment: {
            discount: 0,
            discountType: 'money' // 'money' | 'percent'
        },
        settings: {
            tipPolicy: 'manual', // 'manual' | 'automatic'
            receiptFooter: 'Volte Sempre!' // Texto padrão do rodapé
        }
    };

    let salesChart = null; // Variável para armazenar a instância do gráfico

    // ----------------- MOCK DATA -----------------
    const MOCK_CATEGORIES = [
        { id: 1, name: 'Lanches' },
        { id: 2, name: 'Bebidas' },
        { id: 3, name: 'Porções' },
        { id: 4, name: 'Sobremesas' },
    ];

    const MOCK_PRODUCTS = [
        { id: 1, categoryId: 1, name: 'X-Burger', price: 25.50 },
        { id: 2, categoryId: 1, name: 'X-Salada', price: 22.00 },
        { id: 3, categoryId: 1, name: 'X-Tudo', price: 30.00 },
        { id: 4, categoryId: 2, name: 'Coca-Cola Lata', price: 8.00 },
        { id: 5, categoryId: 2, name: 'Suco de Laranja', price: 9.00 },
        { id: 6, categoryId: 2, name: 'Água com Gás', price: 5.00 },
        { id: 7, categoryId: 3, name: 'Batata Frita', price: 22.00 },
        { id: 8, categoryId: 3, name: 'Anéis de Cebola', price: 24.00 },
        { id: 9, categoryId: 4, name: 'Pudim', price: 12.00 },
    ];

    // ----------------- DOM SELECTORS -----------------
    const categoriesContainer = document.getElementById('categories-container');
    const productsContainer = document.getElementById('products-container');
    const orderItemsList = document.getElementById('order-items-list');
    const subtotalValueEl = document.getElementById('subtotal-value');
    const totalValueEl = document.getElementById('total-value');
    const payButton = document.getElementById('pay-button');
    const paymentModal = document.getElementById('payment-modal');
    const paymentModalClose = document.getElementById('payment-modal-close');
    const paymentModalTotal = document.getElementById('payment-modal-total');
    const tipToggle = document.getElementById('tip-toggle');
    const tipContainer = document.getElementById('tip-container');
    const automaticTipMsg = document.getElementById('automatic-tip-msg');
    const paymentSubtotalEl = document.getElementById('payment-subtotal');
    const paymentServiceFeeEl = document.getElementById('payment-service-fee');
    const paymentServiceRow = document.getElementById('payment-service-row');
    const cpfInput = document.getElementById('cpf-input');
    const discountInput = document.getElementById('discount-input');
    const discountTypeSelect = document.getElementById('discount-type');
    const paymentDiscountRow = document.getElementById('payment-discount-row');
    const paymentDiscountValueEl = document.getElementById('payment-discount-value');
    const paymentOptions = document.querySelector('.payment-options');
    const successModal = document.getElementById('success-modal');
    const successModalClose = document.getElementById('success-modal-close');
    const successModalTitle = document.getElementById('success-modal-title');
    const successModalMessage = document.getElementById('success-modal-message');
    const nfceSimulation = document.getElementById('nfce-simulation');
    const cashPaymentArea = document.getElementById('cash-payment-area');
    const cashInput = document.getElementById('cash-input');
    const printReceiptBtn = document.getElementById('print-receipt-btn');
    const cashChangeText = document.getElementById('cash-change-text');
    const printPreCheckBtn = document.getElementById('print-precheck-btn');
    const confirmCashBtn = document.getElementById('confirm-cash-btn');
    const cashBtn = document.getElementById('cash-btn');
    const cashControlModal = document.getElementById('cash-control-modal');
    const cashControlClose = document.getElementById('cash-control-close');
    const cashClosedView = document.getElementById('cash-closed-view');
    const cashOpenView = document.getElementById('cash-open-view');
    const openingBalanceInput = document.getElementById('opening-balance-input');
    const openRegisterBtn = document.getElementById('open-register-btn');
    const closeRegisterBtn = document.getElementById('close-register-btn');
    const exportReportBtn = document.getElementById('export-report-btn');
    const transactionsList = document.getElementById('transactions-list');
    const sessionHistoryList = document.getElementById('session-history-list');
    const comandaInput = document.getElementById('comanda-input');
    const mesaInput = document.getElementById('mesa-input');
    const toggleEditModeBtn = document.getElementById('toggle-edit-mode-btn');
    const productEditModal = document.getElementById('product-edit-modal');
    const editProductName = document.getElementById('edit-product-name');
    const editProductPrice = document.getElementById('edit-product-price');
    const editProductId = document.getElementById('edit-product-id');
    const saveProductBtn = document.getElementById('save-product-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const addCategoryModal = document.getElementById('add-category-modal');
    const newCategoryName = document.getElementById('new-category-name');
    const confirmAddCategory = document.getElementById('confirm-add-category');
    const closeAddCategory = document.getElementById('close-add-category');
    const addProductBtn = document.getElementById('add-product-btn');
    const addProductModal = document.getElementById('add-product-modal');
    const newProductName = document.getElementById('new-product-name');
    const newProductPrice = document.getElementById('new-product-price');
    const newProductCategory = document.getElementById('new-product-category');
    const confirmAddProduct = document.getElementById('confirm-add-product');
    const closeAddProduct = document.getElementById('close-add-product');
    const openOrdersBtn = document.getElementById('open-orders-btn');
    const incomingOrdersModal = document.getElementById('incoming-orders-modal');
    const incomingOrdersList = document.getElementById('incoming-orders-list');
    const closeIncomingOrders = document.getElementById('close-incoming-orders');
    const loginModal = document.getElementById('login-modal');
    const loginNameInput = document.getElementById('login-name-input');
    const loginBtn = document.getElementById('login-btn');
    const userInfoDisplay = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const receiptFooterInput = document.getElementById('receipt-footer-input');

    // ----------------- RENDER FUNCTIONS -----------------
    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    const updatePaymentModalTotals = () => {
        const baseTotal = state.currentOrder.total;
        
        // Cálculo do Desconto
        let discountVal = parseFloat(discountInput.value);
        if (isNaN(discountVal) || discountVal < 0) discountVal = 0;
        
        let discountAmount = 0;
        if (discountTypeSelect.value === 'percent') {
            discountAmount = baseTotal * (discountVal / 100);
        } else {
            discountAmount = discountVal;
        }
        
        // Garante que o desconto não seja maior que o total
        if (discountAmount > baseTotal) discountAmount = baseTotal;

        const effectiveSubtotal = baseTotal - discountAmount;
        const tipAmount = state.hasTip ? effectiveSubtotal * 0.10 : 0;
        const finalTotal = effectiveSubtotal + tipAmount;

        if (paymentSubtotalEl) paymentSubtotalEl.textContent = formatCurrency(baseTotal);
        if (paymentDiscountValueEl) paymentDiscountValueEl.textContent = `- ${formatCurrency(discountAmount)}`;
        if (paymentDiscountRow) paymentDiscountRow.style.display = discountAmount > 0 ? 'flex' : 'none';
        if (paymentServiceFeeEl) paymentServiceFeeEl.textContent = formatCurrency(tipAmount);
        if (paymentModalTotal) paymentModalTotal.textContent = formatCurrency(finalTotal);
        if (paymentServiceRow) paymentServiceRow.style.display = state.hasTip ? 'flex' : 'none';
    };

    const logSession = (name, role, action) => {
        const history = JSON.parse(localStorage.getItem('session_history')) || [];
        const entry = { time: new Date().toLocaleString('pt-BR'), name, role, action };
        history.unshift(entry); // Adiciona no início
        localStorage.setItem('session_history', JSON.stringify(history));
    };

    const renderCategories = () => {
        categoriesContainer.innerHTML = '';
        state.categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = `category-btn ${state.activeCategoryId === category.id ? 'active' : ''}`;
            btn.textContent = category.name;
            btn.dataset.categoryId = category.id;
            categoriesContainer.appendChild(btn);
        });
    };

    const renderProducts = () => {
        productsContainer.innerHTML = '';
        const filteredProducts = state.activeCategoryId
            ? state.products.filter(p => p.categoryId === state.activeCategoryId)
            : state.products;

        filteredProducts.forEach(product => {
            const btn = document.createElement('button');
            btn.className = `product-btn ${state.isEditMode ? 'edit-mode' : ''}`;
            btn.dataset.productId = product.id;
            btn.innerHTML = `
                ${product.name}
                <span class="product-price">${formatCurrency(product.price)}</span>
            `;
            productsContainer.appendChild(btn);
        });
    };

    const renderOrder = () => {
        orderItemsList.innerHTML = '';
        state.currentOrder.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'order-item';
            itemEl.innerHTML = `
                <div class="order-item-details">
                    <strong>${item.name}</strong> (x${item.quantity}) <br>
                </div>
                <span>${formatCurrency(item.price * item.quantity)}</span>
                <div class="order-item-actions">
                    <button data-product-id="${item.productId}" class="remove-item-btn">X</button>
                </div>
                <input type="text" class="item-note-input" placeholder="Obs: Sem cebola..." value="${item.notes || ''}" data-product-id="${item.productId}">
            `;
            orderItemsList.appendChild(itemEl);
        });
        
        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.dataset.productId, 10);
                removeItemFromOrder(productId);
            });
        });

        // Event listener para observações
        document.querySelectorAll('.item-note-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.dataset.productId, 10);
                updateItemNote(productId, e.target.value);
            });
        });

        calculateTotals();
    };

    const renderCashControl = () => {
        if (!state.cashRegister.isOpen) {
            cashClosedView.style.display = 'block';
            cashOpenView.style.display = 'none';
        } else {
            cashClosedView.style.display = 'none';
            cashOpenView.style.display = 'block';

            // Calculate totals
            const totalSales = state.cashRegister.transactions.reduce((acc, t) => acc + t.total, 0);
            const totalInBox = state.cashRegister.openingBalance + totalSales;

            document.getElementById('summary-opening').textContent = formatCurrency(state.cashRegister.openingBalance);
            document.getElementById('summary-sales').textContent = formatCurrency(totalSales);
            document.getElementById('summary-total').textContent = formatCurrency(totalInBox);

            // Render List
            transactionsList.innerHTML = '';
            state.cashRegister.transactions.forEach(t => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.time}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.method}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(t.total)}</td>
                `;
                transactionsList.appendChild(row);
            });

            // Render Session History
            if (sessionHistoryList) {
                sessionHistoryList.innerHTML = '';
                const history = JSON.parse(localStorage.getItem('session_history')) || [];
                history.forEach(h => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="padding: 5px; border-bottom: 1px solid #eee;">${h.time}</td>
                        <td style="padding: 5px; border-bottom: 1px solid #eee;">${h.name} (${h.role})</td>
                        <td style="padding: 5px; border-bottom: 1px solid #eee;">${h.action}</td>
                    `;
                    sessionHistoryList.appendChild(row);
                });
            }

            // --- Lógica do Gráfico ---
            const ctx = document.getElementById('salesChart');
            if (ctx) {
                // 1. Agrupar totais por categoria
                const categoryTotals = {};
                state.cashRegister.transactions.forEach(t => {
                    if (t.categoryBreakdown) {
                        Object.entries(t.categoryBreakdown).forEach(([catId, value]) => {
                            categoryTotals[catId] = (categoryTotals[catId] || 0) + value;
                        });
                    }
                });

                // 2. Preparar dados para o Chart.js
                const labels = [];
                const data = [];
                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                const bgColors = [];

                state.categories.forEach((cat, index) => {
                    if (categoryTotals[cat.id] > 0) {
                        labels.push(cat.name);
                        data.push(categoryTotals[cat.id]);
                        bgColors.push(colors[index % colors.length]);
                    }
                });

                // 3. Renderizar (destruir anterior se existir para não sobrepor)
                if (salesChart) salesChart.destroy();

                salesChart = new Chart(ctx, {
                    type: 'doughnut', // Pode ser 'bar', 'pie', etc.
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: bgColors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'right' }
                        }
                    }
                });
            }
        }
    };

    const renderIncomingOrders = () => {
        const openOrders = JSON.parse(localStorage.getItem('restaurant_open_orders')) || [];
        
        // Atualiza contador do botão
        if (openOrdersBtn) openOrdersBtn.textContent = `Pedidos (${openOrders.length})`;

        // Renderiza lista no modal
        incomingOrdersList.innerHTML = '';
        const noOrdersMsg = document.getElementById('no-orders-msg');
        
        if (openOrders.length === 0) {
            noOrdersMsg.style.display = 'block';
        } else {
            noOrdersMsg.style.display = 'none';
            openOrders.forEach((order, index) => {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid #eee';
                
                const infoMesa = order.tableId ? `Mesa ${order.tableId}` : '';
                const infoCmd = order.comandaId ? `Cmd ${order.comandaId}` : '';
                const infoGarcom = order.waiterName ? `<span style="color:#666; font-weight:normal;">(${order.waiterName})</span>` : '';
                const identificacao = [infoMesa, infoCmd].filter(Boolean).join(' / ') + ' ' + infoGarcom;

                row.innerHTML = `
                    <td style="padding: 10px;">${order.time}</td>
                    <td style="padding: 10px;"><strong>${identificacao}</strong></td>
                    <td style="padding: 10px;">${formatCurrency(order.total)}</td>
                    <td style="padding: 10px;">
                        <button class="load-order-btn" data-index="${index}" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Carregar
                        </button>
                    </td>
                `;
                incomingOrdersList.appendChild(row);
            });
        }
    };

    const printClosingReport = () => {
        const { openingBalance, transactions } = state.cashRegister;
        const totalSales = transactions.reduce((acc, t) => acc + t.total, 0);
        const finalBalance = openingBalance + totalSales;
        const date = new Date().toLocaleString('pt-BR');

        // Agrupamento por Método
        const methods = { 'Dinheiro': 0, 'Cartão': 0, 'Pix': 0 };
        transactions.forEach(t => {
            const m = t.method;
            if (methods[m] !== undefined) methods[m] += t.total;
            else methods[m] = (methods[m] || 0) + t.total;
        });

        // Agrupamento por Categoria
        const categoryTotals = {};
        transactions.forEach(t => {
            if (t.categoryBreakdown) {
                Object.entries(t.categoryBreakdown).forEach(([catId, value]) => {
                    const cat = state.categories.find(c => c.id == catId);
                    const catName = cat ? cat.name : 'Outros';
                    categoryTotals[catName] = (categoryTotals[catName] || 0) + value;
                });
            }
        });

        const reportContent = `
            <html>
            <head>
                <title>Relatório de Fechamento</title>
                <style>
                    body { font-family: 'Courier New', Courier, monospace; padding: 20px; max-width: 300px; margin: 0 auto; color: #000; }
                    h2, h3 { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 5px; margin: 10px 0; font-size: 1.2em; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9em; }
                    .total { font-weight: bold; border-top: 1px dashed #000; padding-top: 5px; margin-top: 10px; font-size: 1em; }
                    .footer { margin-top: 30px; text-align: center; font-size: 0.8em; }
                </style>
            </head>
            <body>
                <h2>FECHAMENTO DE CAIXA</h2>
                <p style="text-align:center; font-size: 0.8em;">${date}</p>
                
                <h3>RESUMO</h3>
                <div class="row"><span>Fundo Inicial:</span> <span>${formatCurrency(openingBalance)}</span></div>
                <div class="row"><span>Total Vendas:</span> <span>${formatCurrency(totalSales)}</span></div>
                <div class="row total"><span>SALDO FINAL:</span> <span>${formatCurrency(finalBalance)}</span></div>

                <h3>PAGAMENTOS</h3>
                ${Object.entries(methods).map(([method, val]) => val > 0 ? `<div class="row"><span>${method}:</span> <span>${formatCurrency(val)}</span></div>` : '').join('')}

                <h3>POR CATEGORIA</h3>
                ${Object.entries(categoryTotals).map(([cat, val]) => `<div class="row"><span>${cat}:</span> <span>${formatCurrency(val)}</span></div>`).join('')}

                <div class="footer">
                    <p>_____________________________</p>
                    <p>Operador: ${state.cashierName}</p>
                    <p>Login: ${state.loginTime ? new Date(state.loginTime).toLocaleTimeString('pt-BR') : '--:--'}</p>
                    <p>Assinatura do Responsável (${state.cashierName})</p>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=400,height=600');
        printWindow.document.write(reportContent);
        printWindow.document.close();
        
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };

    const printReceipt = (transaction) => {
        const date = transaction.time;
        const items = state.currentOrder.items; // Usamos o pedido atual pois a transação salva apenas totais
        
        // Recalcular valores baseados na transação salva para consistência
        const totalPaid = transaction.total;
        
        let itemsHtml = '';
        items.forEach(item => {
            itemsHtml += `
                <div class="row">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>${formatCurrency(item.price * item.quantity)}</span>
                </div>
            `;
        });

        const receiptContent = `
            <html>
            <head>
                <title>Recibo</title>
                <style>
                    body { font-family: 'Courier New', Courier, monospace; padding: 10px; max-width: 300px; margin: 0 auto; color: #000; font-size: 12px; }
                    h2 { text-align: center; margin: 5px 0; font-size: 1.2em; }
                    .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
                    .total { font-weight: bold; font-size: 1.1em; margin-top: 5px; }
                    .center { text-align: center; }
                </style>
            </head>
            <body>
                <h2>RESTAURANTE PDV</h2>
                <div class="center">Comprovante Não Fiscal</div>
                <div class="center">${new Date().toLocaleDateString('pt-BR')} - ${date}</div>
                <div class="divider"></div>
                
                ${itemsHtml}
                
                <div class="divider"></div>
                
                <div class="row total">
                    <span>TOTAL:</span>
                    <span>${formatCurrency(totalPaid)}</span>
                </div>
                <div class="row">
                    <span>Pagamento:</span>
                    <span>${transaction.method}</span>
                </div>
                
                <div class="divider"></div>
                <div class="center">Obrigado pela preferência!</div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=350,height=500');
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };

    const printPreCheck = () => {
        const baseTotal = state.currentOrder.total;
        
        // Recalcular valores atuais do modal
        let discountVal = parseFloat(discountInput.value);
        if (isNaN(discountVal) || discountVal < 0) discountVal = 0;
        
        let discountAmount = 0;
        if (discountTypeSelect.value === 'percent') {
            discountAmount = baseTotal * (discountVal / 100);
        } else {
            discountAmount = discountVal;
        }
        if (discountAmount > baseTotal) discountAmount = baseTotal;

        const effectiveSubtotal = baseTotal - discountAmount;
        const tipAmount = state.hasTip ? effectiveSubtotal * 0.10 : 0;
        const finalTotal = effectiveSubtotal + tipAmount;

        const items = state.currentOrder.items;
        let itemsHtml = '';
        items.forEach(item => {
            itemsHtml += `
                <div class="row">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>${formatCurrency(item.price * item.quantity)}</span>
                </div>
            `;
        });

        const receiptContent = `
            <html>
            <head>
                <title>Conferência</title>
                <style>
                    body { font-family: 'Courier New', Courier, monospace; padding: 10px; max-width: 300px; margin: 0 auto; color: #000; font-size: 12px; }
                    h2 { text-align: center; margin: 5px 0; font-size: 1.2em; }
                    .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
                    .total { font-weight: bold; font-size: 1.1em; margin-top: 5px; }
                    .center { text-align: center; }
                </style>
            </head>
            <body>
                <h2>RESTAURANTE PDV</h2>
                <div class="center">CONFERÊNCIA DE CONTA</div>
                <div class="center">NÃO É DOCUMENTO FISCAL</div>
                <div class="center">${new Date().toLocaleString('pt-BR')}</div>
                ${cpfInput && cpfInput.value ? `<div class="center">CPF: ${cpfInput.value}</div>` : ''}
                ${transaction.cpf ? `<div class="center">CPF: ${transaction.cpf}</div>` : ''}
                <div class="divider"></div>
                
                ${itemsHtml}
                
                <div class="divider"></div>
                
                <div class="row"><span>Subtotal:</span><span>${formatCurrency(baseTotal)}</span></div>
                ${discountAmount > 0 ? `<div class="row"><span>Desconto:</span><span>-${formatCurrency(discountAmount)}</span></div>` : ''}
                ${tipAmount > 0 ? `<div class="row"><span>Serviço (10%):</span><span>${formatCurrency(tipAmount)}</span></div>` : ''}
                
                <div class="row total">
                    <span>TOTAL A PAGAR:</span>
                    <span>${formatCurrency(finalTotal)}</span>
                </div>
                
                <div class="divider"></div>
                <div class="center">${state.settings.receiptFooter || 'Volte Sempre!'}</div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=350,height=500');
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };

    // ----------------- LOGIC FUNCTIONS -----------------
    const calculateTotals = () => {
        const subtotal = state.currentOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        state.currentOrder.subtotal = subtotal;
        state.currentOrder.total = subtotal; // For now, total is same as subtotal
        
        subtotalValueEl.textContent = formatCurrency(state.currentOrder.subtotal);
        totalValueEl.textContent = formatCurrency(state.currentOrder.total);
        paymentModalTotal.textContent = formatCurrency(state.currentOrder.total);
        
        // Update inputs if needed (usually inputs drive state, but on load state drives inputs)
        if (state.currentOrder.id) comandaInput.value = state.currentOrder.id;
        if (state.currentOrder.tableId) mesaInput.value = state.currentOrder.tableId;
    };

    const addItemToOrder = (productId) => {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = state.currentOrder.items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.currentOrder.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                notes: '' // Inicializa observação vazia
            });
        }
        saveOrderToLocalStorage();
        renderOrder();
    };

    const removeItemFromOrder = (productId) => {
        const itemIndex = state.currentOrder.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) return;

        const item = state.currentOrder.items[itemIndex];
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            state.currentOrder.items.splice(itemIndex, 1);
        }
        saveOrderToLocalStorage();
        renderOrder();
    };

    const updateItemNote = (productId, note) => {
        const item = state.currentOrder.items.find(item => item.productId === productId);
        if (item) {
            item.notes = note;
            saveOrderToLocalStorage();
        }
    };
    
    const saveOrderToLocalStorage = () => {
        localStorage.setItem('currentOrder', JSON.stringify(state.currentOrder));
    };

    const loadOrderFromLocalStorage = () => {
        const savedOrder = localStorage.getItem('currentOrder');
        if (savedOrder) {
            state.currentOrder = JSON.parse(savedOrder);
        }
    };

    const saveCashToLocalStorage = () => {
        localStorage.setItem('cashRegister', JSON.stringify(state.cashRegister));
    };

    const loadCashFromLocalStorage = () => {
        const savedCash = localStorage.getItem('cashRegister');
        if (savedCash) {
            state.cashRegister = JSON.parse(savedCash);
        }
    };

    const saveSettingsToLocalStorage = () => {
        localStorage.setItem('restaurant_settings', JSON.stringify(state.settings));
    };

    const addTransactionToRegister = (order, method) => {
        if (!state.cashRegister.isOpen) return;

        // Recalcular totais com base nos inputs atuais (Desconto e Gorjeta)
        const baseTotal = order.total;
        
        let discountVal = parseFloat(discountInput.value);
        if (isNaN(discountVal) || discountVal < 0) discountVal = 0;
        
        let discountAmount = 0;
        if (discountTypeSelect.value === 'percent') {
            discountAmount = baseTotal * (discountVal / 100);
        } else {
            discountAmount = discountVal;
        }
        if (discountAmount > baseTotal) discountAmount = baseTotal;

        const effectiveSubtotal = baseTotal - discountAmount;
        const tipAmount = state.hasTip ? effectiveSubtotal * 0.10 : 0;
        const finalTotal = effectiveSubtotal + tipAmount;

        // Calcular totais por categoria para este pedido
        const categoryBreakdown = {};
        order.items.forEach(item => {
            const product = state.products.find(p => p.id === item.productId);
            if (product) {
                categoryBreakdown[product.categoryId] = (categoryBreakdown[product.categoryId] || 0) + (item.price * item.quantity);
            }
        });

        const transaction = {
            id: Date.now(),
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            total: finalTotal,
            discount: discountAmount, // Salva o desconto na transação
            cpf: cpfInput ? cpfInput.value : '', // Salva o CPF
            method: method === 'dinheiro' ? 'Dinheiro' : (method === 'cartao' ? 'Cartão' : 'Pix'),
            categoryBreakdown: categoryBreakdown, // Salva o resumo das categorias
            cashier: state.cashierName, // Salva quem fechou a venda
            waiter: order.waiterName || '' // Salva quem fez o pedido (se houver)
        };

        state.cashRegister.transactions.push(transaction);
        saveCashToLocalStorage();
        return transaction; // Retorna a transação criada para uso posterior
    };
    
    const resetOrder = () => {
        state.currentOrder = { id: null, items: [], subtotal: 0, total: 0, waiterName: '' };
        if(cpfInput) cpfInput.value = '';
        saveOrderToLocalStorage();
        renderOrder();
    };
    
    const saveProductsToLocalStorage = () => {
        localStorage.setItem('products', JSON.stringify(state.products));
        renderProducts();
    };

    const saveCategoriesToLocalStorage = () => {
        localStorage.setItem('categories', JSON.stringify(state.categories));
        renderCategories();
        renderProducts();
    };

    const handlePaymentSuccess = (method) => {
        // Register transaction
        const transaction = addTransactionToRegister(state.currentOrder, method);

        paymentModal.style.display = 'none';
        successModal.style.display = 'flex';
        
        // Simulate payment and NFC-e
        successModalTitle.textContent = 'Pagamento Aprovado!';
        successModalMessage.textContent = 'Processando...';
        
        // Configura o botão de imprimir para usar a transação atual
        printReceiptBtn.onclick = () => printReceipt(transaction);
        printReceiptBtn.style.display = 'block';

        nfceSimulation.style.display = 'none';
        
        setTimeout(() => {
            successModalMessage.textContent = 'Comunicando com a SEFAZ...';
            setTimeout(() => {
                successModalTitle.textContent = 'Sucesso!';
                successModalMessage.textContent = '';
                nfceSimulation.style.display = 'block';
            }, 1500);
        }, 1000);
    };

    // ----------------- EVENT HANDLERS -----------------
    categoriesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            const categoryId = parseInt(e.target.dataset.categoryId, 10);
            state.activeCategoryId = state.activeCategoryId === categoryId ? null : categoryId;
            renderCategories();
            renderProducts();
        }
    });

    productsContainer.addEventListener('click', (e) => {
        const productBtn = e.target.closest('.product-btn');
        if (productBtn) {
            const productId = parseInt(productBtn.dataset.productId, 10);
            
            if (state.isEditMode) {
                // Open Edit Modal
                const product = state.products.find(p => p.id === productId);
                editProductId.value = product.id;
                editProductName.value = product.name;
                editProductPrice.value = product.price;
                productEditModal.style.display = 'flex';
            } else {
                addItemToOrder(productId);
            }
        }
    });

    payButton.addEventListener('click', () => {
        if (state.currentOrder.items.length > 0) {
            if (!state.cashRegister.isOpen) {
                alert('O caixa está fechado. Por favor, abra o caixa antes de realizar vendas.');
                cashControlModal.style.display = 'flex';
                renderCashControl();
                return;
            }

            // Resetar inputs de desconto
            discountInput.value = '';
            if(cpfInput) cpfInput.value = '';
            
            // Resetar estado da gorjeta ao abrir modal
            // Verifica a configuração do dono
            if (state.settings.tipPolicy === 'automatic') {
                state.hasTip = true;
                if(tipToggle) tipToggle.checked = true;
                if(tipContainer) tipContainer.style.display = 'none';
                if(automaticTipMsg) automaticTipMsg.style.display = 'block';
            } else {
                state.hasTip = false;
                if(tipToggle) tipToggle.checked = false;
                if(tipContainer) tipContainer.style.display = 'block';
                if(automaticTipMsg) automaticTipMsg.style.display = 'none';
            }
            
            paymentModal.style.display = 'flex';
            cashPaymentArea.style.display = 'none';
            
            updatePaymentModalTotals();
        } else {
            alert('Adicione itens ao pedido antes de pagar.');
        }
    });

    // Toggle Gorjeta
    tipToggle.addEventListener('change', (e) => {
        state.hasTip = e.target.checked;
        updatePaymentModalTotals();
    });

    // Listeners de Desconto
    discountInput.addEventListener('input', updatePaymentModalTotals);
    discountTypeSelect.addEventListener('change', updatePaymentModalTotals);

    paymentModalClose.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });
    
    paymentOptions.addEventListener('click', (e) => {
        if (e.target.classList.contains('payment-option-btn')) {
            const method = e.target.dataset.method;
            
            if (method === 'dinheiro') {
                cashPaymentArea.style.display = 'block';
                cashInput.value = '';
                cashChangeText.textContent = 'Troco: R$ 0,00';
                cashChangeText.style.color = 'black';
                confirmCashBtn.disabled = true;
                confirmCashBtn.style.opacity = '0.6';
                cashInput.focus();
            } else {
                handlePaymentSuccess(method);
            }
        }
    });

    cashInput.addEventListener('input', () => {
        // Recalcular total final para troco
        const baseTotal = state.currentOrder.total;
        let discountVal = parseFloat(discountInput.value);
        if (isNaN(discountVal) || discountVal < 0) discountVal = 0;
        let discountAmount = 0;
        if (discountTypeSelect.value === 'percent') {
            discountAmount = baseTotal * (discountVal / 100);
        } else {
            discountAmount = discountVal;
        }
        if (discountAmount > baseTotal) discountAmount = baseTotal;

        const effectiveSubtotal = baseTotal - discountAmount;
        const tipAmount = state.hasTip ? effectiveSubtotal * 0.10 : 0;
        const total = effectiveSubtotal + tipAmount;

        const received = parseFloat(cashInput.value);

        if (isNaN(received)) {
            cashChangeText.textContent = 'Troco: R$ 0,00';
            return;
        }

        const change = received - total;

        if (change >= -0.01) {
            cashChangeText.textContent = `Troco: ${formatCurrency(Math.max(0, change))}`;
            cashChangeText.style.color = 'green';
            confirmCashBtn.disabled = false;
            confirmCashBtn.style.opacity = '1';
        } else {
            cashChangeText.textContent = `Falta: ${formatCurrency(Math.abs(change))}`;
            cashChangeText.style.color = 'red';
            confirmCashBtn.disabled = true;
            confirmCashBtn.style.opacity = '0.6';
        }
    });

    confirmCashBtn.addEventListener('click', () => {
        handlePaymentSuccess('dinheiro');
    });

    // --- Cash Control Events ---
    cashBtn.addEventListener('click', () => {
        cashControlModal.style.display = 'flex';
        renderCashControl();
    });

    cashControlClose.addEventListener('click', () => {
        cashControlModal.style.display = 'none';
    });

    openRegisterBtn.addEventListener('click', () => {
        const openingValue = parseFloat(openingBalanceInput.value);
        if (isNaN(openingValue)) {
            alert('Digite um valor válido.');
            return;
        }
        state.cashRegister.isOpen = true;
        state.cashRegister.openingBalance = openingValue;
        state.cashRegister.transactions = [];
        saveCashToLocalStorage();
        renderCashControl();
    });

    closeRegisterBtn.addEventListener('click', () => {
        if(confirm('Tem certeza que deseja fechar o caixa? Isso limpará o histórico do dia.')) {
            
            if(confirm('Deseja gerar o relatório de fechamento para impressão/PDF?')) {
                printClosingReport();
            }

            state.cashRegister.isOpen = false;
            state.cashRegister.openingBalance = 0;
            state.cashRegister.transactions = [];
            saveCashToLocalStorage();
            renderCashControl();
        }
    });

    exportReportBtn.addEventListener('click', () => {
        const transactions = state.cashRegister.transactions;
        if (transactions.length === 0) {
            alert('Não há transações para exportar.');
            return;
        }

        // Cabeçalho do CSV (Ponto e vírgula é melhor para Excel PT-BR)
        let csvContent = "Hora;Metodo;Valor;Desconto;Garcom;Caixa\n";

        transactions.forEach(t => {
            const valorFormatado = t.total.toFixed(2).replace('.', ',');
            const descontoFormatado = (t.discount || 0).toFixed(2).replace('.', ',');
            const garcom = t.waiter || '-';
            const caixa = t.cashier || '-';
            csvContent += `${t.time};${t.method};${valorFormatado};${descontoFormatado};${garcom};${caixa}\n`;
        });

        // Adiciona BOM (\ufeff) para o Excel reconhecer acentos UTF-8 corretamente
        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `relatorio_caixa_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    successModalClose.addEventListener('click', () => {
        successModal.style.display = 'none';
        resetOrder();
    });

    // Botão de Conferência
    printPreCheckBtn.addEventListener('click', printPreCheck);

    // --- Comanda & Mesa Inputs ---
    comandaInput.addEventListener('change', (e) => {
        state.currentOrder.id = e.target.value;
        saveOrderToLocalStorage();
    });

    mesaInput.addEventListener('change', (e) => {
        state.currentOrder.tableId = e.target.value;
        saveOrderToLocalStorage();
    });

    // --- Edit Mode Logic ---
    toggleEditModeBtn.addEventListener('click', () => {
        state.isEditMode = !state.isEditMode;
        toggleEditModeBtn.textContent = state.isEditMode ? 'Modo Edição: ON' : 'Modo Edição: OFF';
        toggleEditModeBtn.style.background = state.isEditMode ? '#dc3545' : '#ffc107';
        toggleEditModeBtn.style.color = state.isEditMode ? 'white' : 'black';
        renderProducts(); // Re-render to update styles
    });

    cancelEditBtn.addEventListener('click', () => {
        productEditModal.style.display = 'none';
    });

    saveProductBtn.addEventListener('click', () => {
        const id = parseInt(editProductId.value, 10);
        const newName = editProductName.value;
        const newPrice = parseFloat(editProductPrice.value);

        if (!newName || isNaN(newPrice)) {
            alert('Dados inválidos');
            return;
        }

        const product = state.products.find(p => p.id === id);
        if (product) {
            product.name = newName;
            product.price = newPrice;
            saveProductsToLocalStorage();
            productEditModal.style.display = 'none';
        }
    });

    // --- Add Category Logic ---
    addCategoryBtn.addEventListener('click', () => {
        newCategoryName.value = '';
        addCategoryModal.style.display = 'flex';
        newCategoryName.focus();
    });

    closeAddCategory.addEventListener('click', () => {
        addCategoryModal.style.display = 'none';
    });

    confirmAddCategory.addEventListener('click', () => {
        const name = newCategoryName.value.trim();
        if (!name) return alert('Digite um nome para a categoria.');

        const newId = state.categories.length > 0 ? Math.max(...state.categories.map(c => c.id)) + 1 : 1;
        state.categories.push({ id: newId, name: name });
        saveCategoriesToLocalStorage();
        addCategoryModal.style.display = 'none';
    });

    // --- Add Product Logic ---
    addProductBtn.addEventListener('click', () => {
        // Populate categories select
        newProductCategory.innerHTML = '';
        state.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            newProductCategory.appendChild(option);
        });

        newProductName.value = '';
        newProductPrice.value = '';
        addProductModal.style.display = 'flex';
    });

    closeAddProduct.addEventListener('click', () => {
        addProductModal.style.display = 'none';
    });

    confirmAddProduct.addEventListener('click', () => {
        const name = newProductName.value.trim();
        const price = parseFloat(newProductPrice.value);
        const categoryId = parseInt(newProductCategory.value, 10);

        if (!name || isNaN(price) || !categoryId) return alert('Preencha todos os campos corretamente.');

        const newId = state.products.length > 0 ? Math.max(...state.products.map(p => p.id)) + 1 : 1;
        state.products.push({
            id: newId,
            categoryId: categoryId,
            name: name,
            price: price
        });
        saveProductsToLocalStorage();
        addProductModal.style.display = 'none';
    });

    // --- Incoming Orders Logic ---
    openOrdersBtn.addEventListener('click', () => {
        renderIncomingOrders();
        incomingOrdersModal.style.display = 'flex';
    });

    closeIncomingOrders.addEventListener('click', () => {
        incomingOrdersModal.style.display = 'none';
    });

    // --- Settings Logic ---
    openSettingsBtn.addEventListener('click', () => {
        // Carrega estado atual nos radios
        const radios = document.getElementsByName('tip-policy');
        radios.forEach(r => {
            if (r.value === state.settings.tipPolicy) r.checked = true;
        });
        if(receiptFooterInput) receiptFooterInput.value = state.settings.receiptFooter || '';
        settingsModal.style.display = 'flex';
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    saveSettingsBtn.addEventListener('click', () => {
        const selectedPolicy = document.querySelector('input[name="tip-policy"]:checked').value;
        state.settings.tipPolicy = selectedPolicy;
        if(receiptFooterInput) state.settings.receiptFooter = receiptFooterInput.value;
        saveSettingsToLocalStorage();
        alert('Configurações salvas com sucesso!');
        settingsModal.style.display = 'none';
    });

    // --- Login Logic ---
    const handleLogin = () => {
        const name = loginNameInput.value.trim();
        if (name) {
            state.cashierName = name;
            state.loginTime = new Date();
            sessionStorage.setItem('cashierName', name);
            sessionStorage.setItem('cashierLoginTime', state.loginTime.toISOString());
            logSession(name, 'Caixa', 'Login');
            
            userInfoDisplay.textContent = `Usuário: ${name} (Entrou às ${state.loginTime.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})})`;
            loginModal.style.display = 'none';
        } else {
            alert('Por favor, digite seu nome.');
        }
    };

    loginBtn.addEventListener('click', handleLogin);

    loginNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Logout Logic
    logoutBtn.addEventListener('click', () => {
        if(confirm('Deseja realmente sair e trocar de operador?')) {
            const logoutTime = new Date().toLocaleTimeString('pt-BR');
            alert(`Sessão finalizada às ${logoutTime}`);
            logSession(state.cashierName, 'Caixa', 'Logout');
            
            sessionStorage.removeItem('cashierName');
            sessionStorage.removeItem('cashierLoginTime');
            state.cashierName = '';
            state.loginTime = null;
            userInfoDisplay.textContent = 'Usuário: ...';
            loginNameInput.value = '';
            loginModal.style.display = 'flex';
        }
    });

    // Check session on load
    const savedCashierName = sessionStorage.getItem('cashierName');
    if (savedCashierName) {
        state.cashierName = savedCashierName;
        const savedTime = sessionStorage.getItem('cashierLoginTime');
        state.loginTime = savedTime ? new Date(savedTime) : new Date();
        userInfoDisplay.textContent = `Usuário: ${savedCashierName} (Entrou às ${state.loginTime.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})})`;
        loginModal.style.display = 'none';
    }

    incomingOrdersList.addEventListener('click', (e) => {
        if (e.target.classList.contains('load-order-btn')) {
            const index = parseInt(e.target.dataset.index, 10);
            const openOrders = JSON.parse(localStorage.getItem('restaurant_open_orders')) || [];
            const selectedOrder = openOrders[index];

            if (selectedOrder) {
                // Carrega o pedido no estado atual
                state.currentOrder.items = selectedOrder.items;
                state.currentOrder.id = selectedOrder.comandaId || '';
                state.currentOrder.tableId = selectedOrder.tableId || '';
                state.currentOrder.waiterName = selectedOrder.waiterName || '';
                
                // Remove da lista de pendentes
                openOrders.splice(index, 1);
                localStorage.setItem('restaurant_open_orders', JSON.stringify(openOrders));
                
                saveOrderToLocalStorage();
                renderOrder();
                renderIncomingOrders(); // Atualiza a lista
                incomingOrdersModal.style.display = 'none'; // Fecha modal
            }
        }
    });

    // Escuta alterações no localStorage (para atualizar contador em tempo real se outra aba mudar)
    window.addEventListener('storage', renderIncomingOrders);

    // ----------------- INITIALIZATION -----------------
    const init = () => {
        // Load from LS or use Mocks
        const savedCategories = localStorage.getItem('categories');
        state.categories = savedCategories ? JSON.parse(savedCategories) : MOCK_CATEGORIES;

        const savedProducts = localStorage.getItem('products');
        state.products = savedProducts ? JSON.parse(savedProducts) : MOCK_PRODUCTS;

        const savedSettings = localStorage.getItem('restaurant_settings');
        if (savedSettings) {
            state.settings = JSON.parse(savedSettings);
        }

        state.activeCategoryId = null; // Show all products initially
        
        loadOrderFromLocalStorage();
        loadCashFromLocalStorage();
        
        renderCategories();
        renderProducts();
        renderOrder();
        
        // Initialize inputs from loaded state
        if (state.currentOrder.id) comandaInput.value = state.currentOrder.id;
        if (state.currentOrder.tableId) mesaInput.value = state.currentOrder.tableId;
        
        renderIncomingOrders(); // Check for open orders on load
    };

    init();
});
