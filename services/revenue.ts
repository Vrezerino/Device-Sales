'use server';

import { Revenue } from '@/app/lib/definitions';
import { clientPromise } from '@/app/lib/mongodb';
import { MONGODB_NAME } from '@/app/lib/env';
import { monthOrder } from '@/app/lib/utils';

export const fetchRevenue = async () => {
    try {
      const client = await clientPromise;
      const db = client.db(MONGODB_NAME);
      const revenue = await db.collection('revenue').find({}).toArray();
      const parsedAndStringifiedRevenue: Revenue[] = JSON.parse(JSON.stringify(revenue));
  
      const revebueSortedByMonth = parsedAndStringifiedRevenue.sort((a, b) => {
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });
  
      return revebueSortedByMonth;
    } catch (e) {
      console.error(e);
      throw new Error('Failed to fetch customer revenue!');
    }
  };