import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
	const { url } = JSON.parse(req.body);

	const summary = await prisma.summary.findFirst({
		where: { url },
	});

	return res.status(200).json(summary);
}

export default handle;