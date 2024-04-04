'use server';

import { ObjectId } from 'mongodb';
import { NewInvoice, UpdatingInvoice } from '@/app/lib/definitions';
import { validateInvoice } from '@/app/lib/validations';
import { getMongoDb as db } from '@/app/lib/mongodb';
import { errorWithStatusCode } from '@/app/lib/utils';

import { addInvoice, editInvoice, removeInvoice } from '@/redux/features/invoiceSlice';
import { store } from '@/redux/store';
import { redirect } from 'next/navigation';

const ITEMS_PER_PAGE = 6;
export const fetchFilteredInvoices = async (
  query: string,
  currentPage: number,
) => {
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

    Pagination disabled for now
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
        // Replaces the input document with the specified document
        $replaceRoot: {
          newRoot: {
            // Merge joined documents into a single document
            $mergeObjects: [
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
        // Drop fields from result set we don't need
        $unset: [
          'customerId',
          'company'
        ]
      }
    ]).toArray();

    return JSON.parse(JSON.stringify(invoices));
  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }
};

export const fetchInvoicesPages = async (query: string) => {
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
        // Replaces the input document with the specified document
        $replaceRoot: {
          newRoot: {
            // Merge joined documents into a single document
            $mergeObjects: [
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
    return errorWithStatusCode(e, 500);
  }
};

export const fetchInvoiceById = async (id: string) => {
  try {
    const _id = new ObjectId(id);

    const invoice = await (await db()).collection('invoices').findOne({ _id });

    if (invoice) {
      return JSON.parse(JSON.stringify(invoice));
    } else {
      throw errorWithStatusCode('Invoice not found.', 404);
    }
  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
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
        // Replaces the input document with the specified document
        $replaceRoot: {
          newRoot: {
            // Merge joined documents into a single document
            $mergeObjects: [
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
        // Drop fields from result set we don't need
        $unset: [
          'customerId',
          'department',
          'status',

        ]
      }
      // Sort by date, descending and limit to five results
    ]).sort({ date: -1 }).limit(5).toArray();

    return JSON.parse(JSON.stringify(invoices));
  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }
};

export const postInvoice = async (formData: FormData) => {
  let success = false;
  let invoice;

  try {
    invoice = validateInvoice(formData) as NewInvoice;

    // Insert new invoice to database
    const result = await (await db())
      .collection('invoices')
      .insertOne({ ...invoice, customerId: new ObjectId(invoice.customerId) }).catch((reason) => reason);

    // Ensure insertion was successful, throw error otherwise
    success = result.acknowledged && result.insertedId !== null;
    if (!success) throw new Error('Database error: insertion failed!');

  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }

  /**
   * Dispatch device to store and redirect to device list page.
   * redirect() can't be used inside a try/catch block.
   */
  if (success) {
    store.dispatch(addInvoice(invoice));
    redirect('/dashboard/invoices');
  }
};

export const updateInvoice = async (id: string, formData: FormData) => {
  let success = false;
  let invoice;

  try {
    invoice = validateInvoice(formData) as UpdatingInvoice;
    const _id = new ObjectId(id);

    // Update invoice in database
    const result = await (await db()).collection('invoices').updateOne({ _id }, {
      $set: {
        amountInCents: invoice.amountInCents, status: invoice.status
      }
    });

    // Ensure update was successful, throw error otherwise
    success = result.acknowledged && result.modifiedCount === 1 && result.matchedCount === 1;
    if (!success) throw errorWithStatusCode('Update failed, invoice not found!', 404);

  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }

  // Dispatch invoice modification to store and redirect
  if (success) {
    store.dispatch(editInvoice(invoice));
    redirect('/dashboard/invoices');
  }
};

export const deleteInvoice = async (id: string) => {
  let success = false;
  try {
    const _id = new ObjectId(id);

    // Delete from db, ensure deletion was successful, throw error otherwise
    const result = await (await db()).collection('invoices').deleteOne({ _id });
    success = result.acknowledged && result.deletedCount === 1;
    if (!success) throw errorWithStatusCode('Update failed, invoice not found!', 404);

  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }
  // Dispatch invoice deletion to store and redirect
  if (success) {
    store.dispatch(removeInvoice(id));
    redirect('/dashboard/invoices');
  }
};