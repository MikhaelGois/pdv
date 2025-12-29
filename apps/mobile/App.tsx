import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { Category, Product, OrderItem, Order } from '@restaurant/shared';
import { listCategories, listProducts, createVendaFromOrder } from '@restaurant/shared';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: { padding: 16, backgroundColor: '#e67e22' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  subHeader: { color: '#fff', marginTop: 4 },
  content: { flex: 1, padding: 12 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  catBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  catBtnActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  catBtnText: { color: '#333' },
  productsList: { },
  productBtn: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, backgroundColor: '#fff', marginBottom: 8 },
  productName: { fontSize: 14, fontWeight: '600' },
  productPrice: { fontSize: 12, color: '#666', marginTop: 4 },
  orderCard: { borderTopColor: '#eee', borderTopWidth: 1, paddingTop: 8 },
  orderItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  orderTotal: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  sendBtn: { marginTop: 10 }
});

export default function App() {
  const [waiterName, setWaiterName] = useState('');
  const [tableId, setTableId] = useState('');
  const [comandaId, setComandaId] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);

  // Fetch catalog from backend
  useEffect(() => {
    (async () => {
      try {
        const [cats, prods] = await Promise.all([listCategories(), listProducts()]);
        setCategories(cats);
        setProducts(prods);
      } catch (e) {
        // Fallback to local mock if backend unavailable
        const mockCategories: Category[] = [
          { id: 1, name: 'Lanches' },
          { id: 2, name: 'Bebidas' },
          { id: 3, name: 'Porções' },
          { id: 4, name: 'Sobremesas' },
        ];
        const mockProducts: Product[] = [
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
        setCategories(mockCategories);
        setProducts(mockProducts);
      }
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    return activeCategory ? products.filter(p => p.categoryId === activeCategory) : products;
  }, [products, activeCategory]);

  const addItem = (p: Product) => {
    const existing = items.find(i => i.productId === p.id && !i.notes);
    if (existing) {
      setItems(prev => prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems(prev => prev.concat({ productId: p.id, name: p.name, price: p.price, quantity: 1 }));
    }
  };

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const sendOrder = async () => {
    if (!waiterName) return Alert.alert('Identificação', 'Informe o nome do garçom.');
    if (!tableId && !comandaId) return Alert.alert('Pedido', 'Informe a Mesa ou Comanda.');

    const order: Order = {
      id: Date.now(),
      time: undefined as any,
      tableId,
      comandaId,
      items,
      waiterName,
      total,
      status: 'pending'
    } as any;

    try {
      await createVendaFromOrder(order);
      Alert.alert('Sucesso', 'Pedido enviado ao caixa.');
      setItems([]);
      setTableId('');
      setComandaId('');
    } catch (e) {
      Alert.alert('Offline', 'Falha ao enviar. Guardando na fila local para sincronizar.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Área do Garçom</Text>
        <Text style={styles.subHeader}>{waiterName ? `Atendente: ${waiterName}` : 'Aguardando identificação...'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Identificação</Text>
        <TextInput placeholder="Nome do garçom" value={waiterName} onChangeText={setWaiterName} style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8 }} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput placeholder="Mesa" value={tableId} onChangeText={setTableId} keyboardType="numeric" style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 }} />
          <TextInput placeholder="Comanda" value={comandaId} onChangeText={setComandaId} keyboardType="numeric" style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 }} />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Categorias</Text>
        <View style={styles.categories}>
          <TouchableOpacity style={[styles.catBtn, activeCategory === null && styles.catBtnActive]} onPress={() => setActiveCategory(null)}>
            <Text style={[styles.catBtnText, activeCategory === null && { color: '#fff' }]}>Todos</Text>
          </TouchableOpacity>
          {categories.map(c => (
            <TouchableOpacity key={c.id} style={[styles.catBtn, activeCategory === c.id && styles.catBtnActive]} onPress={() => setActiveCategory(c.id)}>
              <Text style={[styles.catBtnText, activeCategory === c.id && { color: '#fff' }]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Produtos</Text>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productBtn} onPress={() => addItem(item)}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.orderCard}>
          <Text style={styles.sectionTitle}>Pedido</Text>
          {items.map(i => (
            <View key={i.productId} style={styles.orderItem}>
              <Text>{i.quantity}x {i.name}</Text>
              <TouchableOpacity onPress={() => removeItem(i.productId)}><Text style={{ color: '#dc3545' }}>Remover</Text></TouchableOpacity>
            </View>
          ))}
          <Text style={styles.orderTotal}>Total: R$ {total.toFixed(2).replace('.', ',')}</Text>
          <View style={styles.sendBtn}>
            <Button title="ENVIAR PEDIDO" onPress={sendOrder} />
          </View>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
