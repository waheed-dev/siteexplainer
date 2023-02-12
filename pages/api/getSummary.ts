import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
	const { url } = req.body;
  console.log(url);

	const summary = await prisma.summary.findUnique({
		where: { url },
	});

	return res.status(200).json(summary);
}

export default handle;