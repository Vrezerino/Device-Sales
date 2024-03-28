'use server';

import { Customer, CustomerNoId } from '@/app/lib/definitions';
import { DB_NAME, clientPromise } from '@/app/lib/mongodb';
import { writeFile, unlink } from 'fs/promises';
import { ObjectId } from 'mongodb';
import path from 'path';

const dir = '/img/customers/';

export async function getCustomer(id: string) {
  try {
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const customer = await db.collection('customers').findOne({ _id });
    return JSON.parse(JSON.stringify(customer));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get customer!');
  }
};

export async function postCustomer(customer: CustomerNoId) {
  const file = customer.image || null;

  // Create a byte array from file
  const buffer = customer.image && Buffer.from(await file?.arrayBuffer());

  /*
    Create filename from customer's name replacing spaces with underscores, add period,
    add file extension. If no file was uploaded, filename refers to a fallback/generic customer image.
  */
  const filename = file ? `${customer.name.replaceAll(' ', '_')}.${file.type.split('/')[1]}` : '___blankProfile.jpg';

  /*
    Customers do not get inserted into db with the file blob.
    They'll contain a URL to the file instead and the file
    itself is uploaded on /public/img/customers.
  */
  const newCustomer = { ...customer, image_url: dir + filename };
  delete newCustomer.image;
  try {
    // Write file to /public/img/customers/filename
    if (customer.image) {
      await writeFile(
        path.join(process.cwd(), 'public' + dir + filename),
        buffer
      );
    }
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection('customers').insertOne(newCustomer);
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to create customer!');
  }
};

export async function updateCustomer(id: string, customer: CustomerNoId) {
  const file = customer.image || null;

  // Create a byte array from file
  const buffer = customer.image && Buffer.from(await file?.arrayBuffer());

  /*
    Create filename from customer's name, replace spaces with underscores. If no file was uploaded,
    filename refers to a fallback/generic customer image.
  */
  const filename = file ? `${customer.name.replaceAll(' ', '_')}.${file.type.split('/')[1]}` : '___blankProfile.jpg';

  try {
    // Write file to /public/img/customers/filename
    if (customer.image) {
      await writeFile(
        path.join(process.cwd(), 'public' + dir + filename),
        buffer
      );
    }
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection('customers').updateOne({ _id }, {
      $set: {
        name: customer.name,
        email: customer.email,
        image_url: dir + filename,
        company: customer.company
      }
    });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to update customer!');
  }
};

export async function deleteCustomer(id: string) {
  try {
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // For retrieving the profile image filename, for image deletion
    const customer = await db.collection('customers').findOne({ _id });

    // Remove customer from database
    const result = await db.collection('customers').deleteOne({ _id });

    // Delete profile image file from server only if it's not the generic image
    if (!customer?.image_url.includes('___blankProfile')) {
      unlink(path.join(process.cwd(), 'public' + customer?.image_url));
    }
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to delete customer!');
  }
};

export async function fetchCustomers() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Return customers sorted by their names, ascending
    const customers = await db.collection('customers').find({}).sort({ name: 1 }).toArray();

    return JSON.parse(JSON.stringify(customers));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch customers!');
  }
};

export async function fetchFilteredCustomers(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const data = await db.collection('customers').aggregate([
      {
        $lookup: {
          from: 'invoices',
          localField: '_id',
          foreignField: 'customerId',
          as: 'invoices'
        }
      },
      {
        $match: {
          $or: [
            { 'name': { $regex: query, $options: 'i' } },
            { 'email': { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          id: 1,
          name: 1,
          email: 1,
          image_url: 1,
          company: 1,
          totalInvoices: { $size: '$invoices' },
          totalPending: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$invoices',
                    as: 'invoice',
                    cond: { $eq: ['$$invoice.status', 'pending'] }
                  }
                },
                as: 'pendingInvoice',
                in: '$$pendingInvoice.amountInCents'
              }
            }
          },
          totalPaid: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$invoices',
                    as: 'invoice',
                    cond: { $eq: ['$$invoice.status', 'paid'] }
                  }
                },
                as: 'paidInvoice',
                in: '$$paidInvoice.amountInCents'
              }
            }
          }
        }
      },
      {
        $sort: { name: 1 }
      }
    ]).toArray();

    return JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch customer table!');
  }
};