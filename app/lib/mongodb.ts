import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI || !process.env.MONGODB_URI_DEV || !process.env.MONGODB_URI_TEST) {
  throw new Error('One or more database URI environment variables are missing!');
};

let URI: string;
let DB_NAME: string;
const options = {};

// Ternary would be a messy statement with >2 cases, use switch instead.
switch (process.env.NODE_ENV) {
  case 'production':
    URI = process.env.MONGODB_URI;
    DB_NAME = 'device-sales';
    break;
  case 'development':
    URI = process.env.MONGODB_URI_DEV;
    DB_NAME = 'device-sales-dev';
    break;
  case 'test':
    URI = process.env.MONGODB_URI_TEST;
    DB_NAME = 'device-sales-test';
    break;
  default:
    URI = process.env.MONGODB_URI_TEST;
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'production') {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(URI, options);
  clientPromise = client.connect();
  console.log('Connected to Device Sales!');
} else if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(URI, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
  console.log('Connected to Device Sales (dev)!');
} else if (process.env.NODE_ENV === 'test') {
  client = new MongoClient(URI, options);
  clientPromise = client.connect();
  console.log('Connected to Device Sales (test)!');

};

export { clientPromise, DB_NAME };