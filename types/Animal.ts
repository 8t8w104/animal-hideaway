import { Prisma } from "@prisma/client"

export type AnimalWithRelations = Prisma.AnimalGetPayload<{
  include: {
    animalType: true,
    Image: true,
    _count: {
      select: {
        IndividualAnimal: true;
        AdoptionApplication: true;
      }
    }
  }
}>
