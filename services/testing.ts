'use server';

import { DB_NAME, clientPromise } from '@/app/lib/mongodb';
import { customers, devices, invoices, revenue, users } from '@/app/lib/placeholderData';

export const initDb = async () => {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
  
      const res1 = db?.collection('users').insertMany(users);
      const res2 = db?.collection('customers').insertMany(customers);
      const res3 = db?.collection('invoices').insertMany(invoices);
      const res4 = db?.collection('revenue').insertMany(revenue);
      const res5 = db?.collection('devices').insertMany(devices);
  
      await Promise.all([ res1, res2, res3, res4, res5 ])
      console.log('Database initialized!')
  
    } catch (e) {
      console.error(e);
      throw new Error('Failed to initiate database!');
    }
  };
  
  export const clearDb = async () => {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
  
      const res1 = db?.collection('users').deleteMany({});
      const res2 = db?.collection('customers').deleteMany({});
      const res3 = db?.collection('invoices').deleteMany({});
      const res4 = db?.collection('revenue').deleteMany({});
      const res5 = db?.collection('devices').deleteMany({});
  
      await Promise.all([ res1, res2, res3, res4, res5 ])
      console.log('Database cleared!')
    } catch (e) {
      console.error(e);
      throw new Error('Failed to clear database!');
    }
  };