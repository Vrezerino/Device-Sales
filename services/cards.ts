'use server';

import { getMongoDb as db } from '@/app/lib/mongodb';
import { extractErrorMessage, formatCurrency } from '@/app/lib/utils';

export const fetchCardData = async () => {
    try {
      // SELECT COUNT(*) FROM x
      const invoiceCountPromise = (await db()).collection('invoices').countDocuments();
      const customerCountPromise = (await db()).collection('customers').countDocuments();
  
      // SELECT status, SUM(amount) FROM invoices GROUP BY status ASC
      const invoiceStatusPromise = (await db()).collection('invoices').aggregate([
        {
          $group: {
            _id: '$status',
            sum: { $sum: '$amountInCents' },
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]).toArray();
  
      // Parallel data fetching to avoid waterfalls.
      const data = await Promise.all([
        invoiceCountPromise,
        customerCountPromise,
        invoiceStatusPromise,
      ]);
  
      const numberOfInvoices = Number(data[0]) ?? 0;
      const numberOfCustomers = Number(data[1]) ?? 0;
      const totalPaidInvoices = formatCurrency(data[2][0].sum ?? '0');
      const totalPendingInvoices = formatCurrency(data[2][1].sum ?? '0');
  
      return {
        numberOfCustomers,
        numberOfInvoices,
        totalPaidInvoices,
        totalPendingInvoices,
      };
      
    } catch (e) {
      return { error: extractErrorMessage(e) };
    }
  };