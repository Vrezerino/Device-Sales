'use server';

import { User } from '@/app/lib/definitions';
import { getMongoDb as db } from '@/app/lib/mongodb';
import { extractErrorMessage } from '@/app/lib/utils';

export const getUser = async (email: string) => {
  try {

    const user = await (await db()).collection('users').findOne({ email });
    return JSON.parse(JSON.stringify(user));
  } catch (e) {
    return { error: extractErrorMessage(e) };
  }
};

export const createUser = async (user: User) => {
  try {
    await (await db()).collection('users').insertOne(user);
    //return res.status(201).send('Created');
  } catch (e) {
    return { error: extractErrorMessage(e) };
  }
};