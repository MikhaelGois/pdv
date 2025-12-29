import React, { useEffect, useMemo, useState } from 'react';
import type { Category, Product, OrderItem, Order } from '@restaurant/shared';
import { listCategories, listProducts, createVendaFromOrder, confirmPayment, login } from '@restaurant/shared';

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function App() {
  const [cashierName, setCashierName] = useState('');
  const [loginTime, setLoginTime] = useState<Date | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('caixa');
  const [password, setPassword] = useState('1234');

  useEffect(() => {
    (async () => {
      try {
        if (!isLoggedIn) {
          const res = await login(username, password);
          setIsLoggedIn(true);
        }
        const [cats, prods] = await Promise.all([listCategories(), listProducts()]);
        setCategories(cats);
        setProducts(prods);
      } catch (e) {
        setCategories([
          { id: 1, name: 'Lanches' },
          { id: 2, name: 'Bebidas' },
          { id: 3, name: 'Porções' },
          { id: 4, name: 'Sobremesas' },
        ]);
        setProducts([
          { id: 1, categoryId: 1, name: 'X-Burger', price: 25.50 },
          { id: 2, categoryId: 1, name: 'X-Salada', price: 22.00 },
          { id: 3, categoryId: 1, name: 'X-Tudo', price: 30.00 },
          { id: 4, categoryId: 2, name: 'Coca-Cola Lata', price: 8.00 },
          { id: 5, categoryId: 2, name: 'Suco de Laranja', price: 9.00 },
          { id: 6, categoryId: 2, name: 'Água com Gás', price: 5.00 },
          { id: 7, categoryId: 3, name: 'Batata Frita', price: 22.00 },
          { id: 8, categoryId: 3, name: 'Anéis de Cebola', price: 24.00 },
          { id: 9, categoryId: 4, name: 'Pudim', price: 12.00 },
        ]);
      }
    })();
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        const [cats, prods] = await Promise.all([listCategories(), listProducts()]);
        setCategories(cats);
        setProducts(prods);
      })();
    }
  }, [isLoggedIn]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const filteredProducts = useMemo(() => (
    activeCategoryId ? products.filter(p => p.categoryId === activeCategoryId) : products
  ), [products, activeCategoryId]);

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [hasTip, setHasTip] = useState(false);
  const [discountVal, setDiscountVal] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'money' | 'percent'>('money');
  const [cpf, setCpf] = useState('');
  const [registerOpen, setRegisterOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [transactions, setTransactions] = useState<Array<{ time: string; method: string; total: number; categoryBreakdown: Record<number, number> }>>([]);

  const finalCalc = useMemo(() => {
    const base = subtotal;
    let discountAmount = 0;
    if (discountType === 'percent') discountAmount = base * (Math.max(0, discountVal) / 100);
    else discountAmount = Math.max(0, discountVal);
    if (discountAmount > base) discountAmount = base;
    const effectiveSubtotal = base - discountAmount;
    const tipAmount = hasTip ? effectiveSubtotal * 0.10 : 0;
    const total = effectiveSubtotal + tipAmount;
    return { base, discountAmount, tipAmount, total };
  }, [subtotal, hasTip, discountVal, discountType]);

  const addItem = (product: Product) => {
    const existing = orderItems.find(i => i.productId === product.id && !i.notes);
    if (existing) {
      setOrderItems(prev => prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setOrderItems(prev => prev.concat({ productId: product.id, name: product.name, price: product.price, quantity: 1 }));
    }
  };

  const removeItem = (productId: number) => {
    setOrderItems(prev => prev.filter(i => i.productId !== productId));
  };

  const pay = async (method: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro') => {
    if (orderItems.length === 0) return;
    if (!registerOpen) { alert('Abra o caixa antes de pagar.'); return; }
    const order: Order = {
      items: orderItems,
      total: subtotal,
    } as any;
    const created = await createVendaFromOrder(order);
    const venda = created.data;
    await confirmPayment({ vendaId: venda.id, valorReais: finalCalc.total, metodo: method, desconto: finalCalc.discountAmount, gorjeta: finalCalc.tipAmount, cpfConsumidor: cpf });
    // Record transaction for local summary
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const breakdown: Record<number, number> = {};
    orderItems.forEach(i => {
      const p = products.find(pp => pp.id === i.productId);
      if (p) breakdown[p.categoryId] = (breakdown[p.categoryId] || 0) + i.price * i.quantity;
    });
    setTransactions(prev => prev.concat({ time, method: method === 'dinheiro' ? 'Dinheiro' : method.startsWith('cartao') ? 'Cartão' : 'Pix', total: finalCalc.total, categoryBreakdown: breakdown }));
    // Reset state
    setOrderItems([]);
    setHasTip(false);
    setDiscountVal(0);
    setDiscountType('money');
    setCpf('');
    alert('Pagamento confirmado!');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#f8f9fa' }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: 8, minWidth: 320 }}>
          <h2>Login do Caixa</h2>
          <div>
            <label>Usuário</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
          </div>
          <div>
            <label>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
          </div>
          <button onClick={async () => { try { await login(username, password); setIsLoggedIn(true); } catch { alert('Login inválido'); } }} style={{ padding: '0.6rem 1rem' }}>Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8f9fa' }}>
      <header style={{ backgroundColor: '#343a40', color: 'white', padding: '0.8rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>PDV - Nova Venda</h1>
        <span>Usuário: {cashierName || '...'}</span>
      </header>

      <main style={{ display: 'flex', flex: 1, gap: '1rem', padding: '1rem' }}>
        <section style={{ flex: 2, backgroundColor: 'white', borderRadius: 8, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <h2>Comanda #<input type="number" defaultValue={123} /> Mesa #<input type="number" defaultValue={5} /></h2>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {orderItems.map(item => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <span>{item.quantity}x {item.name}</span>
                  {item.notes && <div style={{ fontSize: '0.8rem', color: '#6c757d', marginLeft: '1rem' }}>- {item.notes}</div>}
                </div>
                <span>{formatCurrency(item.price * item.quantity)}</span>
                <button onClick={() => removeItem(item.productId)} style={{ border: 'none', background: 'none', color: '#dc3545' }}>X</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #ccc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Subtotal</strong>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
          </div>
        </section>

        <section style={{ flex: 3, backgroundColor: 'white', borderRadius: 8, padding: '1rem' }}>
          <input type="text" placeholder="Buscar produto..." style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem' }} />
          <h3>Categorias</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <button onClick={() => setActiveCategoryId(null)} style={{ padding: '0.6rem 1rem' }}>Todos</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategoryId(cat.id)} style={{ padding: '0.6rem 1rem' }}>{cat.name}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
            {filteredProducts.map(p => (
              <button key={p.id} onClick={() => addItem(p)} style={{ padding: '1rem', border: '1px solid #dee2e6', borderRadius: 6, textAlign: 'center', background: 'white' }}>
                {p.name}
                <span style={{ display: 'block', color: '#6c757d', marginTop: 4 }}>{formatCurrency(p.price)}</span>
              </button>
            ))}
          </div>
        </section>
        </section>
        <section style={{ flex: 2, background: 'white', borderRadius: 8, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <h3>Controle de Caixa</h3>
          {!registerOpen ? (
            <div>
              <label>Valor de Abertura (R$): </label>
              <input type="number" value={openingBalance} onChange={(e) => setOpeningBalance(Number(e.target.value))} style={{ marginLeft: 6 }} />
              <button onClick={() => setRegisterOpen(true)} style={{ marginLeft: 8 }}>Abrir Caixa</button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div><small>Abertura</small><br/><strong>R$ {openingBalance.toFixed(2).replace('.', ',')}</strong></div>
                <div><small>Vendas</small><br/><strong style={{ color: 'green' }}>R$ {transactions.reduce((a,t)=>a+t.total,0).toFixed(2).replace('.', ',')}</strong></div>
                <div><small>Total (Est.)</small><br/><strong style={{ color: '#007bff' }}>R$ {(openingBalance + transactions.reduce((a,t)=>a+t.total,0)).toFixed(2).replace('.', ',')}</strong></div>
              </div>
              <h4 style={{ marginTop: 10 }}>Vendas (Hoje)</h4>
              <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #eee' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f1f1f1' }}><tr><th style={{ padding: 6, textAlign:'left' }}>Hora</th><th style={{ padding: 6, textAlign:'left' }}>Método</th><th style={{ padding: 6, textAlign:'right' }}>Valor</th></tr></thead>
                  <tbody>
                    {transactions.map((t,i)=>(<tr key={i}><td style={{ padding: 6, borderBottom:'1px solid #eee' }}>{t.time}</td><td style={{ padding: 6, borderBottom:'1px solid #eee' }}>{t.method}</td><td style={{ padding: 6, borderBottom:'1px solid #eee', textAlign:'right' }}>{formatCurrency(t.total)}</td></tr>))}
                  </tbody>
                </table>
              </div>
              <h4 style={{ marginTop: 10 }}>Por Categoria</h4>
              <div>
                {categories.map(c=>{
                  const sum = transactions.reduce((acc,t)=>acc+(t.categoryBreakdown[c.id]||0),0);
                  return sum>0 ? <div key={c.id} style={{ display:'flex', justifyContent:'space-between' }}><span>{c.name}</span><span>{formatCurrency(sum)}</span></div> : null;
                })}
              </div>
              <div style={{ marginTop: 10 }}>
                <button onClick={()=>{
                  const csvHeader = 'Hora;Metodo;Valor\n';
                  const rows = transactions.map(t=>`${t.time};${t.method};${t.total.toFixed(2).replace('.', ',')}`).join('\n');
                  const blob = new Blob(["\ufeff" + csvHeader + rows], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `relatorio_caixa_${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.csv`; a.click();
                  URL.revokeObjectURL(url);
                }}>Exportar CSV</button>
                <button onClick={()=>{ if(confirm('Fechar caixa?')) { setRegisterOpen(false); setOpeningBalance(0); setTransactions([]); } }} style={{ marginLeft: 8, background:'#dc3545', color:'white' }}>Fechar Caixa</button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer style={{ backgroundColor: '#ffffff', padding: '1rem', borderTop: '1px solid #dee2e6' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'center' }}>
          <div>
            <div><strong>Subtotal:</strong> {formatCurrency(finalCalc.base)}</div>
            <div>
              <label>Desconto:</label>
              <input type="number" value={discountVal} onChange={(e) => setDiscountVal(Number(e.target.value))} style={{ width: '100px', marginLeft: 6 }} />
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} style={{ marginLeft: 6 }}>
                <option value="money">R$</option>
                <option value="percent">%</option>
              </select>
            </div>
            {finalCalc.discountAmount > 0 && <div style={{ color: '#dc3545' }}>Desconto: -{formatCurrency(finalCalc.discountAmount)}</div>}
          </div>
          <div>
            <label>
              <input type="checkbox" checked={hasTip} onChange={(e) => setHasTip(e.target.checked)} /> Serviço 10%
            </label>
            {hasTip && <div style={{ color: '#28a745' }}>Gorjeta: {formatCurrency(finalCalc.tipAmount)}</div>}
          </div>
          <div>
            <label>CPF na Nota:</label>
            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} style={{ marginLeft: 6 }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total: {formatCurrency(finalCalc.total)}</div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button onClick={() => pay('pix')} style={{ padding: '0.5rem 1rem' }}>Pix</button>
              <button onClick={() => pay('cartao_credito')} style={{ padding: '0.5rem 1rem' }}>Cartão</button>
              <button onClick={() => pay('dinheiro')} style={{ padding: '0.5rem 1rem' }}>Dinheiro</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
