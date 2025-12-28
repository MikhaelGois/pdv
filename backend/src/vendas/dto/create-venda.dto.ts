export class CreateVendaDto {
  mesa: number;
  itens: ItemVendaDto[];
}

export class ItemVendaDto {
  produtoId: number;
  quantidade: number;
  observacao?: string;
  modificadores?: number[];
}
