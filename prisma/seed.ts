import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
  },
  {
    name: "Nilu",
    email: "nilu@prisma.io",
  },
  {
    name: "Mahmoud",
    email: "mahmoud@prisma.io",
    // posts: {
    //   create: [
    //     {
    //       title: 'Ask a question about Prisma on GitHub',
    //       content: 'https://www.github.com/prisma/prisma/discussions',
    //       published: true,
    //     },
    //     {
    //       title: 'Prisma on YouTube',
    //       content: 'https://pris.ly/youtube',
    //     },
    //   ],
    // },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
