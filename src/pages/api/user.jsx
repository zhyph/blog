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

function createUser(
  db,
  email,
  cpf,
  password,
  name,
  type,
  active,
  base64,
  callback
) {
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
        active,
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
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('User-Agent', '*');
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
      !req.body.type ||
      !req.body.active
    ) {
      res.status(400).json({ error: true, message: 'Missing Body Parameters' });
      return;
    }

    //Verify email does not exist already
    const { db } = await connect();

    const { email, password, type, cpf, name, active, base64 } = req.body;

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
          active,
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
  }
  if (req.method === 'PATCH') {
    if (
      !req.body.userId ||
      !req.body.name ||
      !req.body.email ||
      !req.body.cpf ||
      !req.body.type ||
      !req.body.active
    ) {
      res
        .status(400)
        .json({ error: true, message: 'Faltando corpo do elemento' });
      return;
    }

    const { db } = await connect();

    const { userId, name, email, cpf, type, active } = req.body;
    const collection = db.collection('users');
    collection.findOne({ userId }, (err, user) => {
      if (err) {
        res.status(500).json({ error: true, message: 'Error fiding user' });
        return;
      }
      if (!user) {
        res.status(403).json({ error: true, message: 'UserID errado' });
        return;
      }
      if (user) {
        try {
          collection.updateOne(
            { userId: userId },
            {
              $set: {
                name: name,
                email: email,
                cpf: cpf,
                type: type,
                active: active,
              },
            }
          );
        } catch (e) {
          res.status(403).json({ error: true, message: e });
          return;
        }
        res.status(200).json({ message: 'Atualizado com sucesso!' });
        return;
      }
    });
  }
  if (req.method === 'DELETE') {
    if (!req.body.userId) {
      res.status(400).json({
        error: true,
        message: 'Para deletar é necessario informar userId',
      });
      return;
    }

    const { db } = await connect();

    const { userId } = req.body;
    const collection = db.collection('users');
    collection.findOne({ userId }, (err, user) => {
      if (err) {
        res.status(500).json({ error: true, message: 'Error fiding user' });
        return;
      }
      if (!user) {
        res.status(403).json({ error: true, message: 'UserID errado' });
        return;
      }
      if (user) {
        try {
          collection.deleteOne({ userId: userId });
        } catch (e) {
          res.status(403).json({ error: true, message: e });
          return;
        }
        res.status(200).json({ message: 'Deletado com successo com succeso!' });
        return;
      }
    });
  }
  // else {
  //   res.status(400).json({ error: true, message: 'Wrong Method' });
  //   return;
  // }
};
