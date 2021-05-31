// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';

interface ResponseType {
  message: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<void> => {
  const { db } = await connect();

  if (req.method === 'POST') {
    const response = await db.collection('users').insertOne({
      name: 'Daniel',
      age: 22,
    });
    res.status(200).json(response.ops[0]);
  } else {
    res.status(400).json({ message: 'Wrong Method' });
  }
};
