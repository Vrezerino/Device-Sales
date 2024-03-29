import { MongoClient } from 'mongodb';
import { MONGO_URI } from './env'

let client;
let clientPromise: Promise<MongoClient>;
const options = {};

if (process.env.NODE_ENV === 'production') {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGO_URI, options);
  clientPromise = client.connect();
  console.log('Connected to Device Sales!');
} else if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGO_URI, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
  console.log('Connected to Device Sales (dev)!');
} else if (process.env.NODE_ENV === 'test') {
  client = new MongoClient(MONGO_URI, options);
  clientPromise = client.connect();
  console.log('Connected to Device Sales (test)!');

};

export { clientPromise };