import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.local.env' });

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  // 動物の種類を作成
  const animalTypes = await prisma.animalType.createMany({
    data: [
      { type: '犬' },
      { type: '猫' },
      { type: '鳥' },
    ],
  });

  // // 個人ユーザーを作成
  // const individuals = await prisma.individual.createMany({
  //   data: [
  //     { individualId: 'indiv_001' },
  //     { individualId: 'indiv_002' },
  //     { individualId: 'indiv_003' },
  //   ],
  // });

  // // 団体を作成
  // const organizations = await prisma.organization.createMany({
  //   data: [
  //     { organizationId: 'org_001' },
  //     { organizationId: 'org_002' },
  //     { organizationId: 'org_003' },
  //   ],
  // });

  // 動物を作成
  const animals = await prisma.animal.createMany({
    data: [
      { name: 'ポチ', gender: 'オス', age: 2, animalTypeId: 1, applicationStatus: '募集中', publicStatus: '公開' },
      { name: 'タマ', gender: 'メス', age: 3, animalTypeId: 2, applicationStatus: '審査中', publicStatus: '公開' },
      { name: 'ピーちゃん', gender: '不明', age: 1, animalTypeId: 3, applicationStatus: '決定', publicStatus: '非公開' },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
