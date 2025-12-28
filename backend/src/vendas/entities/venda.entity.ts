export class Venda {
  id: number;
  mesa: number;
  total: number;
  status: 'aberta' | 'fechada' | 'cancelada';
  createdAt: Date;
  updatedAt: Date;
}
