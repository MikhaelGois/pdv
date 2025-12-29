import { Module } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { PagamentosController } from './pagamentos.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PagamentosController],
  providers: [PagamentosService, PrismaService],
})
export class PagamentosModule {}
