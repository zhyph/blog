import { Db, MongoClient } from 'mongodb';

interface ConnectType {
  db: Db;
  client: MongoClient;
}
// Comenta o comando que vc mudou
const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function connect(): Promise<ConnectType> {
  if (!client.isConnected()) {
    await client.connect();
  }
  // Comenta o comando que vc mudou
  const db = client.db('blog');
  return { db, client };
}
