import { Prisma } from "@prisma/client"

export type AnimalWithRelations = Prisma.AnimalGetPayload<{
  include: {
    animalType: true
  }
}>
