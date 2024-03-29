'use server';

import { CustomerNoId } from '@/app/lib/definitions';
import { clientPromise } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { AWS_NAME, AWS_URL, MONGODB_NAME, imgDirCustomers } from '@/app/lib/env';
import s3 from '@/aws.config';

export async function getCustomer(id: string) {
  try {
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(MONGODB_NAME);

    const customer = await db.collection('customers').findOne({ _id });
    return JSON.parse(JSON.stringify(customer));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get customer!');
  }
};

export async function postCustomer(customer: CustomerNoId) {
  try {
    // File upload is optional so file could be null
    const file = customer.image || null;

    /*
      Create filename from customer name, replacing spaces with underscores,
      add period, add file extension. If no file was uploaded, filename refers
      to a fallback/generic profile image in the storage.
    */
    const filename = file
      ? `${customer.name.replaceAll(' ', '_')}.${file.type.split('/')[1]}`
      : '___blankProfile.jpg';

    // If user submitted a file...
    if (file) {
      // create a byte array from it
      const buffer = Buffer.from(await file?.arrayBuffer());

      // and upload the image file to Amazon S3 storage
      const params = {
        Bucket: AWS_NAME,
        // Key needs to be dir/subdir/filename, so remove forward slash from start
        Key: `${imgDirCustomers.substring(1)}${filename}`,
        Body: buffer,
      };

      await s3.upload(params, (err: any, data: any) => {
        if (err) {
          throw new Error(err);
        } else {
          console.log(data);
        }
      }).promise();
    }

    /*
      Insert customer then into the database.
      Customers do not get inserted into db with the file blob.
      They'll contain a URL to the file instead and the file
      itself is uploaded on Amazon storage.
    */
    const newCustomer = { ...customer, imageUrl: `${AWS_URL}${imgDirCustomers}${filename}` };
    delete newCustomer.image;

    const client = await clientPromise;
    const db = client.db(MONGODB_NAME);

    // If insertion was successful, return newCustomer to be saved in app state
    const result = await db.collection('customers').insertOne(newCustomer);
    if (result.acknowledged) return newCustomer;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to create customer!');
  }
};

export async function updateCustomer(id: string, customer: CustomerNoId) {
  try {
    // File upload is optional so file could be null
    const file = customer.image || null;

    /*
      Create filename from customer name, replacing spaces with underscores,
      add period, add file extension. If no file was uploaded, filename refers
      to a fallback/generic profile image in the storage.
    */
    const filename = file
      ? `${customer.name.replaceAll(' ', '_')}.${file.type.split('/')[1]}`
      : '___blankProfile.jpg';

    // If user submitted a file...
    if (file) {
      // create a byte array from it
      const buffer = Buffer.from(await file?.arrayBuffer());

      // and upload the image file to Amazon S3 storage
      const params = {
        Bucket: AWS_NAME,
        // Key needs to be dir/subdir/filename, so remove forward slash from start
        Key: `${imgDirCustomers.substring(1)}${filename}`,
        Body: buffer,
      };

      await s3.upload(params, (err: any, data: any) => {
        if (err) {
          throw new Error(err);
        } else {
          console.log(data);
        }
      }).promise();
    }

    // Modify customer in the database
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(MONGODB_NAME);

    const result = await db.collection('customers').updateOne({ _id }, {
      $set: {
        name: customer.name,
        email: customer.email,
        imageUrl: `${AWS_URL}${imgDirCustomers}${filename}`,
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
    const db = client.db(MONGODB_NAME);

    // Get customer image filename for image deletion
    const customer = await db.collection('customers').findOne({ _id });

    const params = {
      Bucket: AWS_NAME,
      Key: customer?.imageUrl
    };

    // Remove image from Amazon storage
    await s3.deleteObject(params, (err: any) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log('Image was deleted from S3 bucket.');
      }
    }).promise();

    // Remove customer from database
    const result = await db.collection('customers').deleteOne({ _id });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to delete customer!');
  }
};

export async function fetchCustomers() {
  try {
    const client = await clientPromise;
    const db = client.db(MONGODB_NAME);

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
    const db = client.db(MONGODB_NAME);

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
          imageUrl: 1,
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