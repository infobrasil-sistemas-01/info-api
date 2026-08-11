import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const plans = [
    {
      name: 'Free',
      reqMin: 30,
      reqMonth: 10000,
      maxPageSize: 100,
      maxDateRangeDays: 7,
      price: 0,
    },
    {
      name: 'Profissional',
      reqMin: 120,
      reqMonth: 500000,
      maxPageSize: 500,
      maxDateRangeDays: 31,
      price: 199,
    },
    {
      name: 'Enterprise',
      reqMin: 300,
      reqMonth: 1500000,
      maxPageSize: 1000,
      maxDateRangeDays: 92,
      price: 499,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  console.log('Planos populados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
