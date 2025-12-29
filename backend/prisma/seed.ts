import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Lanches' },
    { name: 'Bebidas' },
    { name: 'Porções' },
    { name: 'Sobremesas' },
  ];

  for (const c of categories) {
    const exists = await prisma.category.findFirst({ where: { name: c.name } });
    if (!exists) {
      await prisma.category.create({ data: c });
    }
  }

  // Seed products if none
  const count = await prisma.product.count();
  if (count === 0) {
    const cats = await prisma.category.findMany();
    const byName: Record<string, number> = {};
    cats.forEach(c => (byName[c.name] = c.id));

    await prisma.product.createMany({
      data: [
        { name: 'X-Burger', price: 25.5, categoryId: byName['Lanches'] },
        { name: 'X-Salada', price: 22.0, categoryId: byName['Lanches'] },
        { name: 'X-Tudo', price: 30.0, categoryId: byName['Lanches'] },
        { name: 'Coca-Cola Lata', price: 8.0, categoryId: byName['Bebidas'] },
        { name: 'Suco de Laranja', price: 9.0, categoryId: byName['Bebidas'] },
        { name: 'Água com Gás', price: 5.0, categoryId: byName['Bebidas'] },
        { name: 'Batata Frita', price: 22.0, categoryId: byName['Porções'] },
        { name: 'Anéis de Cebola', price: 24.0, categoryId: byName['Porções'] },
        { name: 'Pudim', price: 12.0, categoryId: byName['Sobremesas'] },
      ],
    });
  }

  // Seed default users (passwords hashed: '1234' not actually hashed here; store plain for demo)
  const users = [
    { username: 'garcom', role: 'GARCOM' as const },
    { username: 'caixa', role: 'CAIXA' as const },
    { username: 'admin', role: 'ADMIN' as const },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: { username: u.username, role: u.role, passwordHash: '1234' },
    });
  }

  console.log('Seed finished');
}

main().finally(async () => {
  await prisma.$disconnect();
});
