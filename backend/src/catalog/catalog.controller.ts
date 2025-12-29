import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  @Get('categories')
  categories() {
    return this.service.categories();
  }

  @Get('products')
  products() {
    return this.service.products();
  }
}
