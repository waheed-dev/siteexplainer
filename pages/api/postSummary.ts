import { prisma } from '../../lib/prisma';

export default async function handle(req: any, res: any) {
  const { url, summary } = req.body;

  const summaryData = await prisma.page.findFirst({
    where: { url }
  });

  if (summaryData) {
    return res.json({
      error: 'summary already exists'
    })
  }

  const result = await prisma.page.create({
    data: {
      url: url,
      summary: summary
    },
  });
  res.json(result);
}