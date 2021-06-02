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
  res: NextApiResponse
) => {


  const { db } = await connect();
  if (req.method === 'GET') {

    

    const response = await db.collection('user').find().toArray()
    .then(items => {
      console.log(`Successfully found ${items.length} documents.`)
      //items.forEach(console.log)
      return items
    })
    .catch(err => console.error(`Failed to find documents: ${err}`))

    res.status(200).json(response);

    return;

  }
  if (req.method === 'POST') {
    const { email, password, type , cpf , base64 } = req.body;
    
    if (!email || !password || !type) {
      res.status(400).json({ error: 'Missing Body Parameters' });
      
      return;
    }
    const { db } = await connect();
    const response = await db.collection('user').insertOne({
     email,
     password,
     type,
     cpf,
     base64

    });
    res.status(200).json(response.ops[0]);
  }
  

else {
    res.status(400).json({ error: 'Wrong Method' });
  }
};
