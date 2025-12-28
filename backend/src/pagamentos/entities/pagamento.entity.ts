export class Pagamento {
  id: number;
  vendaId: number;
  stripePaymentIntentId: string;
  valor: number;
  status: 'pendente' | 'succeeded' | 'failed';
  createdAt: Date;
}
