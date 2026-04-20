import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@dev.com' },
    update: {},
    create: {
      email: 'admin@dev.com',
      name: 'Usuario Principal',
    },
  });

  console.log('✅ Usuário de teste criado ou já existente:', user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
