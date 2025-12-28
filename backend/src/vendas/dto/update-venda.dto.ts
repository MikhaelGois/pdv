// import { PartialType } from '@nestjs/mapped-types';
// import { CreateVendaDto } from './create-venda.dto';

// export class UpdateVendaDto extends PartialType(CreateVendaDto) {}

// Manually creating a partial type for now
export class UpdateVendaDto {
    mesa?: number;
    itens?: any[]; // Simplified for now
    status?: string;
  }
