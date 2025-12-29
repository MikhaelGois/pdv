import { Injectable } from '@nestjs/common';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagamentosService {
  constructor(private prisma: PrismaService) {}
  // In a real app, you would inject the Stripe client.
  // constructor(private readonly stripe: Stripe) {}

  createPaymentIntent(createPagamentoDto: CreatePagamentoDto) {
    const { vendaId, valor } = createPagamentoDto;
    // Mock implementation:
    console.log(`Creating payment intent for venda ${vendaId} with valor ${valor}`);
    return {
      clientSecret: `pi_${vendaId}_secret_${Date.now()}`,
      valor,
    };
  }

  async confirm(createPagamentoDto: CreatePagamentoDto & { desconto?: number; gorjeta?: number; cpfConsumidor?: string }) {
    const { vendaId, valor, metodo, desconto = 0, gorjeta = 0, cpfConsumidor } = createPagamentoDto;
    // valor is in cents; convert to reais
    const valorReais = Math.round(valor) / 100;
    // create Payment and mark Order as paid
    const payment = await this.prisma.payment.create({
      data: {
        orderId: vendaId,
        valor: valorReais,
        metodo,
        desconto,
        gorjeta,
      },
    });
    await this.prisma.order.update({ where: { id: vendaId }, data: { status: 'paid', cpfConsumidor } });
    return { ok: true, paymentId: payment.id };
  }

  handleWebhook(event: any) {
    // Mock implementation:
    console.log(`Received Stripe webhook event: ${event.type}`);
    // Here you would handle events like 'payment_intent.succeeded'
    // and update the order status in your database.
    return { received: true };
  }

  findOne(id: number) {
    return `This action returns a #${id} pagamento`;
  }
}
