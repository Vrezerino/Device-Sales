'use server';

import { User } from '@/app/lib/definitions';
import { getMongoDb as db } from '@/app/lib/mongodb';
import { errorWithStatusCode } from '@/app/lib/utils';

export const getUser = async (email: string) => {
  try {
    const user = await (await db()).collection('users').findOne({ email });

    if (user) {
      return JSON.parse(JSON.stringify(user));
    } else {
      throw errorWithStatusCode('User not found!', 404);
    }

  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }
};

export const createUser = async (user: User) => {
  try {
    const result = await (await db()).collection('users').insertOne(user);
    if (result.acknowledged && result.insertedId !== null) {
      return result.insertedId;
    }

  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }
};