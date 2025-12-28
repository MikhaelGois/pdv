import Head from 'next/head';
import { useState } from 'react';

// Mock data based on the wireframe
const initialOrderItems = [
  { id: 1, name: 'X-Burger', price: 25.50, quantity: 1, notes: 'Sem cebola' },
  { id: 2, name: 'Suco de Laranja', price: 9.00, quantity: 2, notes: '' },
  { id: 3, name: 'Porção de Batata', price: 22.00, quantity: 1, notes: '' },
];

const categories = ['Lanches', 'Bebidas', 'Porções', 'Sobremesas'];
const frequentItems = ['X-Tudo', 'Coca-Cola Lata', 'Água com Gás'];

export default function PosPage() {
  const [orderItems, setOrderItems] = useState(initialOrderItems);
  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Basic component styling using inline styles and simple CSS classes
  const styles = {
    page: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8f9fa' },
    header: { backgroundColor: '#343a40', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between' },
    main: { display: 'flex', flex: 1, padding: '1rem', gap: '1rem' },
    comanda: { flex: 2, backgroundColor: 'white', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column' },
    produtos: { flex: 3, backgroundColor: 'white', borderRadius: '8px', padding: '1rem' },
    footer: { backgroundColor: '#ffffff', padding: '1rem', borderTop: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    total: { fontSize: '1.5rem', fontWeight: 'bold' },
    payButton: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '5px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' },
    item: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' },
    itemNotes: { fontSize: '0.8rem', color: '#6c757d', marginLeft: '1rem' },
    orderSummary: { marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #ccc' },
  };

  return (
    <>
      <Head>
        <title>PDV - Nova Venda</title>
      </Head>
      <div style={styles.page}>
        <header style={styles.header}>
          <h1>PDV - Nova Venda</h1>
          <span>Usuário: Caixa 1</span>
        </header>

        <main style={styles.main}>
          {/* Comanda Section */}
          <section style={styles.comanda}>
            <h2>Comanda #123 (Mesa 5)</h2>
            <div style={{ flex: 1 }}>
              {orderItems.map(item => (
                <div key={item.id} style={styles.item}>
                  <div>
                    <span>{item.quantity}x {item.name}</span>
                    {item.notes && <div style={styles.itemNotes}>- {item.notes}</div>}
                  </div>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={styles.orderSummary}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <strong>Subtotal</strong>
                <strong>R$ {subtotal.toFixed(2)}</strong>
              </div>
            </div>
          </section>

          {/* Produtos Section */}
          <section style={styles.produtos}>
            <input type="text" placeholder="Buscar produto..." style={{width: '100%', padding: '0.8rem', marginBottom: '1rem'}}/>
            <h3>Categorias</h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {categories.map(cat => <button key={cat} style={{padding: '1rem', flex: 1}}>{cat}</button>)}
            </div>
            <h3>Itens Frequentes</h3>
            <div>
              {frequentItems.map(item => <button key={item} style={{width: '100%', padding: '0.8rem', textAlign: 'left', marginBottom: '0.5rem'}}>{item}</button>)}
            </div>
          </section>
        </main>

        <footer style={styles.footer}>
          <div style={styles.total}>
            <span>Total: </span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <button style={styles.payButton}>PAGAR</button>
        </footer>
      </div>
    </>
  );
}
