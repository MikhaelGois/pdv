import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';

@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post('intent')
  createPaymentIntent(@Body() createPagamentoDto: CreatePagamentoDto) {
    // This would create a payment intent with Stripe
    return this.pagamentosService.createPaymentIntent(createPagamentoDto);
  }

  @Post('webhook')
  handleWebhook(@Body() stripeEvent: any) {
    // This would handle incoming webhooks from Stripe
    return this.pagamentosService.handleWebhook(stripeEvent);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagamentosService.findOne(+id);
  }
}
