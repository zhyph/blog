import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
const jwtSecret = process.env.JWT_SECRET;

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'GET') {
    if (!('token' in req.cookies)) {
      res.status(401).json({ message: 'Unable to auth' });
      return;
    }
    let decoded;
    const token = req.cookies.token;
    if (token) {
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (e) {
        console.error(e);
      }
    }
    if (decoded) {
      res.json(decoded);
      return;
    } else {
      res.status(401).json({ message: 'Unable to auth' });
    }
  } else {
    res.status(400).json({ error: true, message: 'Wrong method' });
  }
};
