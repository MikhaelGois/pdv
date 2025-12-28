// c:\Users\MBalieroDG\OneDrive - Luxottica Group S.p.A\Área de Trabalho\gerenciador de restaurante\garcom.js
document.addEventListener('DOMContentLoaded', () => {
    // Carrega dados compartilhados do LocalStorage (mesmos do Caixa)
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    const state = {
        orderItems: [], // { productId, name, price, quantity, notes }
        activeCategoryId: null,
        waiterName: '',
        loginTime: null
    };

    // Elementos DOM
    const categoriesContainer = document.getElementById('categories-container');
    const productsContainer = document.getElementById('products-container');
    const orderItemsList = document.getElementById('order-items-list');
    const totalValueEl = document.getElementById('total-value');
    const tableInput = document.getElementById('table-input');
    const comandaInput = document.getElementById('comanda-input');
    const sendOrderBtn = document.getElementById('send-order-btn');
    const searchInput = document.getElementById('search-input');
    const loginModal = document.getElementById('login-modal');
    const loginNameInput = document.getElementById('login-name-input');
    const loginBtn = document.getElementById('login-btn');
    const waiterDisplay = document.getElementById('waiter-display');
    const logoutBtn = document.getElementById('logout-btn');

    // --- Funções de Renderização ---
    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    const logSession = (name, role, action) => {
        const history = JSON.parse(localStorage.getItem('session_history')) || [];
        const entry = { time: new Date().toLocaleString('pt-BR'), name, role, action };
        history.unshift(entry);
        localStorage.setItem('session_history', JSON.stringify(history));
    };

    const renderCategories = () => {
        categoriesContainer.innerHTML = '';
        // Botão "Todos"
        const allBtn = document.createElement('button');
        allBtn.className = `category-btn ${state.activeCategoryId === null ? 'active' : ''}`;
        allBtn.textContent = 'Todos';
        allBtn.onclick = () => { state.activeCategoryId = null; renderCategories(); renderProducts(); };
        categoriesContainer.appendChild(allBtn);

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `category-btn ${state.activeCategoryId === cat.id ? 'active' : ''}`;
            btn.textContent = cat.name;
            btn.onclick = () => { state.activeCategoryId = cat.id; renderCategories(); renderProducts(); };
            categoriesContainer.appendChild(btn);
        });
    };

    const renderProducts = () => {
        productsContainer.innerHTML = '';
        const term = searchInput.value.toLowerCase();
        
        let filtered = state.activeCategoryId
            ? products.filter(p => p.categoryId === state.activeCategoryId)
            : products;

        if (term) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
        }

        filtered.forEach(product => {
            const btn = document.createElement('button');
            btn.className = 'product-btn';
            btn.innerHTML = `${product.name}<span class="product-price">${formatCurrency(product.price)}</span>`;
            btn.onclick = () => addItem(product);
            productsContainer.appendChild(btn);
        });
    };

    const renderOrder = () => {
        orderItemsList.innerHTML = '';
        let total = 0;

        if (state.orderItems.length === 0) {
            orderItemsList.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Nenhum item adicionado</p>';
        }

        state.orderItems.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const el = document.createElement('div');
            el.className = 'order-item';
            el.innerHTML = `
                <div class="order-item-details">
                    <strong>${item.name}</strong> (x${item.quantity})
                </div>
                <span>${formatCurrency(item.price * item.quantity)}</span>
                <div class="order-item-actions">
                    <button onclick="removeItem(${index})" class="remove-item-btn">X</button>
                </div>
                <input type="text" class="item-note-input" placeholder="Obs: Sem cebola..." 
                       value="${item.notes || ''}" onchange="updateNote(${index}, this.value)">
            `;
            orderItemsList.appendChild(el);
        });

        totalValueEl.textContent = formatCurrency(total);
    };

    // --- Lógica do Pedido ---
    window.addItem = (product) => {
        const existing = state.orderItems.find(i => i.productId === product.id && !i.notes); // Agrupa se não tiver obs
        if (existing) {
            existing.quantity++;
        } else {
            state.orderItems.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                notes: ''
            });
        }
        renderOrder();
    };

    window.removeItem = (index) => {
        state.orderItems.splice(index, 1);
        renderOrder();
    };

    window.updateNote = (index, note) => {
        state.orderItems[index].notes = note;
    };

    // --- Enviar Pedido ---
    sendOrderBtn.addEventListener('click', () => {
        if (state.orderItems.length === 0) return alert('Adicione itens ao pedido.');
        
        const table = tableInput.value;
        const comanda = comandaInput.value;

        if (!table && !comanda) return alert('Informe a Mesa ou a Comanda.');

        const orderData = {
            id: Date.now(), // ID único do pedido
            time: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
            tableId: table,
            comandaId: comanda,
            items: state.orderItems,
            waiterName: state.waiterName,
            total: state.orderItems.reduce((acc, i) => acc + (i.price * i.quantity), 0),
            status: 'pending'
        };

        // Salva na lista de pedidos abertos (compartilhada com o Caixa)
        const openOrders = JSON.parse(localStorage.getItem('restaurant_open_orders')) || [];
        openOrders.push(orderData);
        localStorage.setItem('restaurant_open_orders', JSON.stringify(openOrders));

        alert('Pedido enviado com sucesso!');
        
        // Limpa a tela
        state.orderItems = [];
        tableInput.value = '';
        comandaInput.value = '';
        renderOrder();
    });

    searchInput.addEventListener('input', renderProducts);

    // --- Lógica de Login ---
    const handleLogin = () => {
        const name = loginNameInput.value.trim();
        if (name) {
            state.waiterName = name;
            state.loginTime = new Date();
            sessionStorage.setItem('waiterName', name); // Salva na sessão
            sessionStorage.setItem('waiterLoginTime', state.loginTime.toISOString());
            logSession(name, 'Garçom', 'Login');
            
            waiterDisplay.textContent = `Atendente: ${name} (Entrou às ${state.loginTime.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})})`;
            loginModal.style.display = 'none';
        } else {
            alert('Por favor, digite seu nome.');
        }
    };

    loginBtn.addEventListener('click', handleLogin);
    
    // Permite dar Enter no input de nome
    loginNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Logout Logic
    logoutBtn.addEventListener('click', () => {
        if(confirm('Deseja sair?')) {
            logSession(state.waiterName, 'Garçom', 'Logout');
            sessionStorage.removeItem('waiterName');
            sessionStorage.removeItem('waiterLoginTime');
            state.waiterName = '';
            state.loginTime = null;
            waiterDisplay.textContent = 'Aguardando identificação...';
            loginNameInput.value = '';
            loginModal.style.display = 'flex';
        }
    });

    // Verifica se já tem login salvo na sessão
    const savedName = sessionStorage.getItem('waiterName');
    if (savedName) {
        loginNameInput.value = savedName;
        state.waiterName = savedName;
        const savedTime = sessionStorage.getItem('waiterLoginTime');
        state.loginTime = savedTime ? new Date(savedTime) : new Date();
        waiterDisplay.textContent = `Atendente: ${savedName} (Entrou às ${state.loginTime.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})})`;
        loginModal.style.display = 'none';
    }

    // Inicialização
    renderCategories();
    renderProducts();
});
