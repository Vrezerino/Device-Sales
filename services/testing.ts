'use server';

import { getMongoDb as db } from '@/app/lib/mongodb';
import { customers, devices, invoices, revenue, users } from '@/app/lib/placeholderData';

export const initDb = async () => {
    try {
      const res1 = (await db())?.collection('users').insertMany(users);
      const res2 = (await db())?.collection('customers').insertMany(customers);
      const res3 = (await db())?.collection('invoices').insertMany(invoices);
      const res4 = (await db())?.collection('revenue').insertMany(revenue);
      const res5 = (await db())?.collection('devices').insertMany(devices);
  
      await Promise.all([ res1, res2, res3, res4, res5 ])
      console.log('Database initialized!')
  
    } catch (e) {
      console.error(e);
      throw new Error('Failed to initiate database!');
    }
  };
  
  export const clearDb = async () => {
    try {
      const res1 = (await db())?.collection('users').deleteMany({});
      const res2 = (await db())?.collection('customers').deleteMany({});
      const res3 = (await db())?.collection('invoices').deleteMany({});
      const res4 = (await db())?.collection('revenue').deleteMany({});
      const res5 = (await db())?.collection('devices').deleteMany({});
  
      await Promise.all([ res1, res2, res3, res4, res5 ])
      console.log('Database cleared!')
    } catch (e) {
      console.error(e);
      throw new Error('Failed to clear database!');
    }
  };