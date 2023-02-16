import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const summary = await prisma.page.findMany();
  return res.status(200).json(summary);
}

export default handle;