import { Page } from '@prisma/client'
import { prisma } from '../../lib/prisma'

export default async function latestSites(req: any, res: { json: (arg0: Page[]) => void }) {
  const sites = await prisma.page.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  res.json(sites)
}