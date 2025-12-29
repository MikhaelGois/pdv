import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post('intent')
  @UseGuards(JwtGuard)
  createPaymentIntent(@Body() createPagamentoDto: CreatePagamentoDto) {
    // This would create a payment intent with Stripe
    return this.pagamentosService.createPaymentIntent(createPagamentoDto);
  }

  @Post('webhook')
  handleWebhook(@Body() stripeEvent: any) {
    // This would handle incoming webhooks from Stripe
    return this.pagamentosService.handleWebhook(stripeEvent);
  }

  @Post('confirm')
  @UseGuards(JwtGuard)
  confirm(@Body() dto: any) {
    return this.pagamentosService.confirm(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagamentosService.findOne(+id);
  }
}
