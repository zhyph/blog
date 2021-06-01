// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';

interface ErrorResponseType {
  error: string;
}

interface SuccesResponseType {
  _id: string;
  name: string;
  email: string;
  image: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccesResponseType>
): Promise<void> => {
  if (req.method === 'POST') {
    const { name, email, image } = req.body;

    if (!name || !email || !image) {
      res.status(400).json({ error: 'Missing Body Parameters' });
      return;
    }
    const { db } = await connect();

    const response = await db.collection('users').insertOne({
      name,
      email,
      image,
    });
    res.status(200).json(response.ops[0]);
  } else {
    res.status(400).json({ error: 'Wrong Method' });
  }
};
