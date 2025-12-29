import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async categories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async products() {
    return this.prisma.product.findMany({ orderBy: { name: 'asc' } });
  }
}
