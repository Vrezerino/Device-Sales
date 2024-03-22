'use server';

import { Customer, NewCustomer } from '@/app/lib/definitions';
import { DB_NAME, clientPromise } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

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
  
  export async function postCustomer(customer: NewCustomer) {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
  
      const result = await db.collection('customers').insertOne(customer);
      return result;
    } catch (e) {
      console.error(e);
      throw new Error('Failed to create customer!');
    }
  };
  
  export async function updateCustomer(id: string, customer: Customer) {
    try {
      const _id = new ObjectId(id);
      const client = await clientPromise;
      const db = client.db(DB_NAME);
  
      const result = await db.collection('customers').updateOne({ _id }, {
        $set: {
          name: customer.name,
          email: customer.email,
          image_url: customer.image_url,
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
      const db = client.db(DB_NAME);
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