import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FiscalService } from './fiscal.service';
import { CreateNfceDto } from './dto/create-nfce.dto';

@Controller('fiscal')
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  @Post('nfce')
  emitirNfce(@Body() createNfceDto: CreateNfceDto) {
    // This would start the process of issuing an NFC-e
    return this.fiscalService.emitirNfce(createNfceDto);
  }

  @Get('nfce/:id')
  consultarNfce(@Param('id') id: string) {
    // This would check the status of a previously issued NFC-e
    return this.fiscalService.consultarNfce(+id);
  }
}
