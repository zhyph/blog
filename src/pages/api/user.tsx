// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';
import assert from 'assert';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
const saltRounds = 10;

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

function findUser(db, email, callback) {
  const collection = db.collection('users');
  collection.findOne({ email }, callback);
}

function createUser(db, email, cpf, password, name, callback) {
  const collection = db.collection('users');
  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    collection.insertOne(
      {
        userId: v4(),
        email,
        cpf,
        password: hash,
        name,
        // imageBase64,
      },
      function (err, userCreated) {
        assert.strictEqual(err, null);
        callback(userCreated);
      }
    );
  });
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'POST') {
    //signup
    if (
      !req.body.email ||
      !req.body.cpf ||
      !req.body.password ||
      !req.body.name
      // ||!req.body.imageBase64
    ) {
      res.status(403).json({ error: true, message: 'Missing Important Field' });
      return;
    }

    // try {
    //   assert.notStrictEqual(null, req.body.email, 'Email Required');
    //   assert.notStrictEqual(null, req.body.cpf, 'CPF Required');
    //   assert.notStrictEqual(null, req.body.password, 'Password Required');
    // } catch (bodyError) {
    //   res.status(403).json({ error: true, message: bodyError.message });
    // }

    //Verify email does not exist already
    const { db } = await connect();
    // const email = req.body.email;
    // const cpf = req.body.cpf;
    // const password = req.body.password;
    // const name = req.body.name;

    const { email, cpf, password, name, imageBase64 } = req.body;

    findUser(db, email, (err, user) => {
      if (err) {
        res.status(500).json({ error: true, message: 'Error fiding user' });
        return;
      }
      if (!user) {
        // proceed to Create
        createUser(
          db,
          email,
          cpf,
          password,
          name,
          // imageBase64,
          (creationResult) => {
            if (creationResult.ops.length === 1) {
              const user = creationResult.ops[0];
              const token = jwt.sign(
                { userId: user.userId, email: user.email },
                jwtSecret,
                { expiresIn: 60 * 60 } //60 minutes
              );
              res.status(200).json({ token });
              return;
            }
          }
        );
      } else {
        //User Exists
        res.status(403).json({ error: true, message: 'Email exists' });
        return;
      }
    });
  } else {
    res.status(400).json({ error: true, message: 'Wrong Method' });
  }

  // if (req.method === 'POST') {
  //   const { password, email, cpf } = req.body;
  //   if (!password || !email || !cpf) {
  //     res.status(400).json({ error: 'Missing Body Parameters' });
  //     return;
  //   }
  //   const { db } = await connect();
  //   const response = await createUser(db, email, cpf, password);
  //   // const response = await db.collection('users').insertOne({
  //   //   email,
  //   //   cpf,
  //   //   password,
  //   // });
  //   res.status(200).json(response.ops[0]);
  // } else {
  //   res.status(400).json({ error: 'Wrong Method' });
  // }
};
