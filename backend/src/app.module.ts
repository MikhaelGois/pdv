import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendasModule } from './vendas/vendas.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';
import { FiscalModule } from './fiscal/fiscal.module';

@Module({
  imports: [VendasModule, PagamentosModule, FiscalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
