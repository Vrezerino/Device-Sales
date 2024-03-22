'use server';

import { User } from '@/app/lib/definitions';
import { DB_NAME, clientPromise } from '@/app/lib/mongodb';

export async function getUser(email: string) {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
  
      const user = await db.collection('users').findOne({ email });
      return JSON.parse(JSON.stringify(user));
    } catch (e) {
      console.error(e);
      throw new Error('Failed to get user!');
    }
  };
  
  export async function createUser(user: User) {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
  
      await db.collection('users').insertOne(user);
      //return res.status(201).send('Created');
    } catch (e) {
      console.error(e);
      throw new Error('Failed to create user!');
    }
  };