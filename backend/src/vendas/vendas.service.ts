import { Injectable } from '@nestjs/common';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendasService {
  constructor(private prisma: PrismaService) {}

  async create(createVendaDto: CreateVendaDto) {
    // Calculate total from product prices
    const productIds = createVendaDto.itens.map(i => i.produtoId);
    const products = await this.prisma.product.findMany({ where: { id: { in: productIds } } });

    const itemsData = createVendaDto.itens.map(i => {
      const p = products.find(pp => pp.id === i.produtoId);
      const price = p ? p.price : 0;
      return { produtoId: i.produtoId, quantity: i.quantidade, observacao: i.observacao, price };
    });
    const total = itemsData.reduce((acc, it) => acc + it.price * it.quantity, 0);

    const order = await this.prisma.order.create({
      data: {
        mesa: createVendaDto.mesa,
        status: 'pending',
        total,
        items: { create: itemsData.map(d => ({ produtoId: d.produtoId, quantity: d.quantity, observacao: d.observacao, price: d.price })) },
      },
      include: { items: true },
    });
    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({ where: { id }, include: { items: true } });
  }

  update(id: number, updateVendaDto: UpdateVendaDto) {
    return this.prisma.order.update({ where: { id }, data: updateVendaDto as any });
  }

  async remove(id: number) {
    await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
    return this.prisma.order.delete({ where: { id } });
  }
}
