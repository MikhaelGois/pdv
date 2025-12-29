import axios from 'axios';

export type Category = { id: number; name: string };
export type Product = { id: number; categoryId: number; name: string; price: number };
export type OrderItem = { productId: number; name: string; price: number; quantity: number; notes?: string };
export type PaymentMethod = 'dinheiro' | 'cartao' | 'pix';
export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export type Order = {
  id?: number | string;
  time?: string;
  tableId?: number | string | null;
  comandaId?: number | string | null;
  items: OrderItem[];
  waiterName?: string;
  total: number;
  status?: OrderStatus;
};

export const api = axios.create({
  baseURL: (typeof process !== 'undefined' && (process as any).env?.API_URL) || 'http://localhost:3000',
});

export function setToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function login(username: string, password: string) {
  const res = await api.post('/auth/login', { username, password });
  const { access_token } = res.data;
  setToken(access_token);
  return res.data;
}

export async function listCategories(): Promise<Category[]> {
  const res = await api.get('/catalog/categories');
  return res.data;
}

export async function listProducts(): Promise<Product[]> {
  const res = await api.get('/catalog/products');
  return res.data;
}

export async function createVendaFromOrder(order: Order) {
  const dto = {
    mesa: Number(order.tableId) || 0,
    itens: order.items.map(i => ({
      produtoId: i.productId,
      quantidade: i.quantity,
      observacao: i.notes,
    })),
  };
  return api.post('/vendas', dto);
}

export async function confirmPayment(params: { vendaId: number; valorReais: number; metodo: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro'; desconto?: number; gorjeta?: number; cpfConsumidor?: string }) {
  const { vendaId, valorReais, metodo, desconto = 0, gorjeta = 0, cpfConsumidor } = params;
  const body = {
    vendaId,
    valor: Math.round(valorReais * 100),
    metodo,
    desconto,
    gorjeta,
    cpfConsumidor,
  };
  const res = await api.post('/pagamentos/confirm', body);
  return res.data;
}

// Deprecated placeholder removed; use listProducts()
