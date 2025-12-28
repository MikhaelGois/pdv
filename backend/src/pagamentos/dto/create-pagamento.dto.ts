export class CreatePagamentoDto {
  vendaId: number;
  valor: number; // in cents, e.g., 1000 for R$ 10.00
  metodo: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';
}
