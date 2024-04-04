'use server';

import { CustomerNoId } from '@/app/lib/definitions';
import { getMongoDb as db } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

import { validateCustomer } from '@/app/lib/validations';
import { errorWithStatusCode } from '@/app/lib/utils';

import s3 from '@/aws.config';
import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { AWS_NAME, AWS_URL, imgDirCustomers } from '@/app/lib/env';

import { store } from '@/redux/store';
import { addCustomer, editCustomer, removeCustomer } from '@/redux/features/customerSlice';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const getCustomer = async (id: string) => {
  try {
    const customer = await (await db()).collection('customers').aggregate([
      {
        $match: {
          _id: new ObjectId(id)
        }
      },
      // Left join with the invoices collection
      {
        $lookup: {
          from: 'invoices',
          localField: '_id',
          foreignField: 'customerId',
          as: 'invoices'
        }
      },
      // Project needed fields only
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
      }
    ]).toArray();

    if (customer) {
      return JSON.parse(JSON.stringify(customer[0]));
    } else {
      throw errorWithStatusCode(`Customer doesn't exist!`, 404);
    }

  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }
};

export const postCustomer = async (formData: FormData) => {
  // Helper boolean variable to be used for page redirection upon successful database insertion
  let success = false;

  // Customer with no image file and with image url instead, for db and redux state
  let newCustomer;

  try {
    const customer: CustomerNoId = validateCustomer(formData);

    // File upload is optional so file could be null
    const file = customer.image || null;

    /**
     * Create filename from customer name, replacing spaces with underscores,
     * add period, add file extension. If no file was uploaded, filename refers
     * to a fallback/generic profile image in the storage.
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

      const upload = new Upload({
        client: s3,
        params
      });

      upload.on('httpUploadProgress', (_progress) => {
        //
      });

      await upload.done();
    }

    /**
     * Insert customer then into the database.
     * Customers do not get inserted into db with the file blob.
     * They'll contain a URL to the file instead, the file
     * itself was uploaded on the Amazon storage.
     */
    newCustomer = { ...customer, imageUrl: `${AWS_URL}${imgDirCustomers}${filename}` };
    delete newCustomer.image;
    const result = await (await db()).collection('customers').insertOne(newCustomer);

    // Ensure insertion was successful, throw error otherwise
    success = result.acknowledged && result.insertedId !== null;
    if (!success) throw new Error('Database error: insertion failed!')

  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }

  /**
   * Finally, dispatch customer to store and redirect to customer list page.
   * redirect() can't be used inside a try/catch block.
   */
  if (newCustomer && success) {
    store.dispatch(addCustomer(newCustomer));
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
  }
};

export const updateCustomer = async (id: string, formData: FormData) => {
  // Helper boolean variable to be used for page redirection upon successful database insertion
  let success = false;
  let customer: CustomerNoId;

  try {
    customer = validateCustomer(formData);

    // File upload is optional so file could be null
    const file = customer.image || null;

    /**
     * Create filename from customer name, replacing spaces with underscores,
     * add period, add file extension. If no file was uploaded, filename refers
     * to a fallback/generic profile image in the storage.
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

      const upload = new Upload({
        client: s3,
        params
      });

      upload.on('httpUploadProgress', (_progress) => {
        //
      });

      await upload.done();
    }

    // Modify customer in the database
    const _id = new ObjectId(id);

    const result = await (await db()).collection('customers').updateOne({ _id }, {
      $set: {
        name: customer.name,
        email: customer.email,
        imageUrl: `${AWS_URL}${imgDirCustomers}${filename}`,
        company: customer.company
      }
    });

    // Ensure that modification was successful, throw error otherwise
    success = result.acknowledged && result.matchedCount === 1 && result.modifiedCount === 1;
    if (!success) throw errorWithStatusCode(`Customer doesn't exist!`, 404);

  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }
  // Finally, update customer in store
  if (success && customer) {
    store.dispatch(editCustomer(customer));
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
  }
};

export const deleteCustomer = async (id: string) => {
  let success = false;
  try {
    const _id = new ObjectId(id);

    // Get customer image filename for image deletion
    const customer = await (await db()).collection('customers').findOne({ _id });

    // Remove profile image only if it's not the fallback/default image
    if (customer?.imageUrl.substring(67) !== '___blankProfile.jpg') {
      const params = {
        Bucket: AWS_NAME,
        /**
         * The domain part is not needed when deleting file from S3 storage, only
         * directory/filename: img/customer/filename.jpeg
         */
        Key: customer?.imageUrl?.substring(53)
      };

      // Remove image from Amazon storage
      const command = new DeleteObjectCommand(params);
      await s3.send(command);
    }

    // Delete from db, ensure deletion was successful, throw error otherwise
    const result = await (await db()).collection('customers').deleteOne({ _id });
    success = result.acknowledged && result.deletedCount === 1;
    if (!success) throw errorWithStatusCode(`Customer doesn't exist!`, 404);

  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }

  // Dispatch customer deletion to store and redirect to customer list page
  if (success) {
    store.dispatch(removeCustomer(id));
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
  }
};

export const fetchCustomers = async () => {
  try {
    // Return customers sorted by their names, ascending
    const customers = await (await db()).collection('customers').find({}).sort({ name: 1 }).toArray();

    return JSON.parse(JSON.stringify(customers));
  } catch (e) {
    console.error(e);
    return errorWithStatusCode(e, 500);
  }
};

export const fetchFilteredCustomers = async (query: string) => {
  try {
    const data = await (await db()).collection('customers').aggregate([
      {
        $match: {
          $or: [
            { 'name': { $regex: query, $options: 'i' } },
            { 'email': { $regex: query, $options: 'i' } }
          ]
        }
      },
      // Left join with the invoices collection
      {
        $lookup: {
          from: 'invoices',
          localField: '_id',
          foreignField: 'customerId',
          as: 'invoices'
        }
      },
      // Project needed fields only
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
    return errorWithStatusCode(e, 500);
  }
};