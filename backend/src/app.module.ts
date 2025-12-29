import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendasModule } from './vendas/vendas.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';
import { FiscalModule } from './fiscal/fiscal.module';
import { CatalogModule } from './catalog/catalog.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [VendasModule, PagamentosModule, FiscalModule, CatalogModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
