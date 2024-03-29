'use server';

import { InvoiceForm, NewInvoice } from '@/app/lib/definitions';
import { getMongoDb as db } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const queryString = query;
  try {
    /* Equivalent SQL query:
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    Pagination disabled for now.
    */

    const invoices = await (await db()).collection('invoices').aggregate([
      {
        '$lookup': {
          'from': 'customers', // Collection to join
          'localField': 'customerId', // From invoices field
          'foreignField': '_id', // From customers field
          'as': 'filteredInvoices' // Output array field
        }
      },
      {
        $replaceRoot: { // Replaces the input document with the specified document.
          newRoot: {
            $mergeObjects: [ // Merge joined documents into a single document.
              {
                $arrayElemAt: ['$filteredInvoices', 0]
              }, '$$ROOT'
            ]
          }
        }
      },
      {
        $match: {

          $or: [
            { name: { $regex: new RegExp(query, 'i') } },
            { email: { $regex: new RegExp(query, 'i') } },
            { amount: { $regex: new RegExp(query, 'i') } },
            { date: { $regex: new RegExp(query, 'i') } },
            { status: { $regex: new RegExp(query, 'i') } }
          ]

        }
      },
      {
        $project: {
          filteredInvoices: 0
        }
      },
      {
        $unset: [ // Drop fields from result set we don't need.
          //'_id',
          'customerId',
          'company'
        ]
      }
    ]).toArray();
    return JSON.parse(JSON.stringify(invoices));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch invoices!');
  }
};

export async function fetchInvoicesPages(query: string) {
  try {
    const count = (await db()).collection('invoices').aggregate([
      {
        '$lookup': {
          'from': 'customers', // Collection to join
          'localField': 'customerId', // From invoices field
          'foreignField': '_id', // From customers field
          'as': 'invoiceCount' // Output array field
        }
      },
      {
        $replaceRoot: { // Replaces the input document with the specified document.
          newRoot: {
            $mergeObjects: [ // Merge joined documents into a single document.
              {
                $arrayElemAt: ['$invoiceCount', 0]
              }, '$$ROOT'
            ]
          }
        }
      },
      {
        $match: {
          $or: [
            { name: { query } },
            { email: { query } },
            { amountInCents: { query } },
            { date: { query } },
            { status: { query } }
          ]
        }
      },
      {
        $count: 'invoiceCount'
      },
    ]);

    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch total number of invoices!');
  }
};

export async function fetchInvoiceById(id: string) {
  try {
    const _id = new ObjectId(id);

    const invoice = await (await db()).collection('invoices').findOne({ _id });
    return JSON.parse(JSON.stringify(invoice));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch invoice!');
  }
};

export const fetchLatestInvoices = async () => {
  try {
    // JOIN Invoices and Customers.
    const invoices = await (await db()).collection('invoices').aggregate([
      {
        '$lookup': {
          'from': 'customers', // Collection to join
          'localField': 'customerId', // From invoices field
          'foreignField': '_id', // From customers field
          'as': 'latestInvoices' // Output array field
        }
      },
      {
        $replaceRoot: { // Replaces the input document with the specified document.
          newRoot: {
            $mergeObjects: [ // Merge joined documents into a single document.
              {
                $arrayElemAt: ['$latestInvoices', 0]
              }, '$$ROOT'
            ]
          }
        }
      },
      {
        $project: {
          latestInvoices: 0
        }
      },
      {
        $unset: [ // Drop fields from result set we don't need.
          //'_id',
          'customerId',
          'department',
          'status',

        ]
      }
    ]).sort({ date: -1 }).limit(5).toArray(); // Sort by date, descending and limit to five results.

    return JSON.parse(JSON.stringify(invoices));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch latest invoices!');
  }
};

export async function postInvoice(invoice: NewInvoice, /*res: NextApiResponse*/) {
  try {
    const result = await (await db()).collection('invoices').insertOne({ ...invoice, customerId: new ObjectId(invoice.customerId) });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to insert new invoice!');
  }
};

export async function updateInvoice(id: string, invoice: InvoiceForm) {
  try {
    const _id = new ObjectId(id);
    const result = await (await db()).collection('invoices').updateOne({ _id }, {
      $set: {
        amountInCents: invoice.amount, status: invoice.status
      }
    });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to update invoice!');
  }
};

export async function deleteInvoice(id: string) {
  try {
    const _id = new ObjectId(id);
    const result = await (await db()).collection('invoices').deleteOne({ _id });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to delete invoice!');
  }
};