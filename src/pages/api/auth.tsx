import { NextApiRequest, NextApiResponse } from "next";
import connect from "../../utils/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
const saltRounds = 10;

function authUser(db, email, password, hash, callback) {
  const collection = db.collection("users");
  bcrypt.compare(password, hash, callback);
}

function findUser(db, email, callback) {
  const collection = db.collection("users");
  collection.findOne({ email }, callback);
}
export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === "POST") {
    if (!req.body.email || !req.body.password) {
      res
        .status(403)
        .json({ error: true, message: "Missing Important Fields" });
      return;
    }

    const { db } = await connect();
    const email = req.body.email;

    const password = req.body.password;

    findUser(db, email, function (err, user) {
      if (err) {
        res.status(500).json({ error: true, message: "Error finding User" });
        return;
      }
      if (!user) {
        res.status(404).json({ error: true, message: "User not found" });
        return;
      } else {
        authUser(db, email, password, user.password, function (err, match) {
          if (err) {
            res.status(500).json({ error: true, message: "Auth Failed" });
          }
          if (match) {
            const token = jwt.sign(
              { userId: user.userId, email: user.email },
              jwtSecret,
              {
                expiresIn: 60 * 60,
              }
            );
            res.status(200).json({ token });
            return;
          } else {
            res.status(401).json({ error: true, message: "Auth Failed" });
            return;
          }
        });
      }
    });
  } else {
    res.status(400).json({ error: true, message: "Wrong Method" });
  }
};
