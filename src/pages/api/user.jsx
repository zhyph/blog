// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';
import assert from 'assert';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
const saltRounds = 10;

function findUser(db, email, callback) {
  const collection = db.collection('users');
  collection.findOne({ email }, callback);
}

function createUser(db, email, cpf, password, name, type, base64, callback) {
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
        type,
        base64,
      },
      function (err, userCreated) {
        assert.strictEqual(err, null);
        callback(userCreated);
      }
    );
  });
}

export default async (req, res) => {
  if (req.method === 'GET') {
    const { db } = await connect();
    const response = await db
      .collection('users')
      .find()
      .toArray()
      .then((items) => {
        console.log(`Successfully found ${items.length} documents.`);
        return items;
      })
      .catch((err) => console.error(`Failed to find documents: ${err}`));

    res.status(200).json(response);
    return;
  }
  if (req.method === 'POST') {
    if (
      !req.body.email ||
      !req.body.cpf ||
      !req.body.password ||
      !req.body.name ||
      !req.body.type
    ) {
      res.status(400).json({ error: 'Missing Body Parameters' });
      return;
    }

    //Verify email does not exist already
    const { db } = await connect();

    const { email, password, type, cpf, name, base64 } = req.body;

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
          type,
          base64,
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
};
