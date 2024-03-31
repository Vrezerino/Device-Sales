'use server';

import { Revenue } from '@/app/lib/definitions';
import { getMongoDb as db } from '@/app/lib/mongodb';
import { extractErrorMessage, monthNames } from '@/app/lib/utils';

export const fetchRevenue = async () => {
    try {
      const revenue = await (await db()).collection('revenue').find({}).toArray();
      const parsedAndStringifiedRevenue: Revenue[] = JSON.parse(JSON.stringify(revenue));
  
      const revebueSortedByMonth = parsedAndStringifiedRevenue.sort((a, b) => {
        return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
      });
  
      return revebueSortedByMonth;
    } catch (e) {
      return { error: extractErrorMessage(e) };
    }
  };