import { Db, MongoClient } from 'mongodb';

interface ConnectType {
  db: Db;
  client: MongoClient;
}

const client = new MongoClient('mongodb+srv://exdefalt:evolution@cluster0.mkz8w.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function connect(): Promise<ConnectType> {
  if (!client.isConnected()) {
    await client.connect();
  }
  const db = client.db('nextdb');
  return { db, client };
}
