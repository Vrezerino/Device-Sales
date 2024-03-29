'use server';

import { clientPromise } from '@/app/lib/mongodb';
import { MONGODB_NAME } from '@/app/lib/env';
import { formatCurrency } from '@/app/lib/utils';

export const fetchCardData = async () => {
    try {
      const client = await clientPromise;
      const db = client.db(MONGODB_NAME);
  
      // SELECT COUNT(*) FROM x
      const invoiceCountPromise = db.collection('invoices').countDocuments();
      const customerCountPromise = db.collection('customers').countDocuments();
  
      // SELECT status, SUM(amount) FROM invoices GROUP BY status ASC
      const invoiceStatusPromise = db.collection('invoices').aggregate([
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
      console.error(e);
      throw new Error('Failed to fetch card data!');
    }
  };