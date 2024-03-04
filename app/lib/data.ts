import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import {
  users,
  customers,
  invoices,
  revenue,
  devices
} from './placeholder-data';
import { formatCurrency } from './utils';

//import { GetStaticProps } from 'next';
import { Devices } from './definitions';
import { clientPromise, DB_NAME } from './mongodb';

export const initDb = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    /*
    const users = db.listCollections({ name: 'users' });
    if (!users) {
      db.createCollection('users');
      // ...
    }*/

    db?.collection('users').insertMany(users);
    db?.collection('customers').insertMany(customers);
    db?.collection('invoices').insertMany(invoices);
    db?.collection('revenue').insertMany(revenue);
    db?.collection('devices').insertMany(devices);

  } catch (e) {
    console.error(e);
    throw new Error('Failed to initiate database!');
  }
};

export const fetchDevices = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const devices = await db.collection('devices').find({}).sort({ deviceName: -1 }).toArray();
    return JSON.parse(JSON.stringify(devices));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch devices!');
  }
};

export const fetchRevenue = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const revenue = await db.collection('revenue').find({}).toArray();
    return JSON.parse(JSON.stringify(revenue));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch customer revenue!');
  }
};

export const fetchLatestInvoices = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // JOIN Invoices and Customers.
    const invoices = await db.collection('invoices').aggregate([
      {
        '$lookup': {
          'from': 'customers', // Collection to join
          'localField': 'customer_id', // From invoices field
          'foreignField': 'id', // From customers field
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
          '_id',
          'customer_id',
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

export const fetchCardData = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // SELECT COUNT(*) FROM x
    const invoiceCountPromise = db.collection('invoices').countDocuments();
    const customerCountPromise = db.collection('customers').countDocuments();

    // SELECT status, SUM(amount) FROM invoices GROUP BY status ASC
    const invoiceStatusPromise = db.collection('invoices').aggregate([
      {
        $group: {
          _id: '$status',
          sum: { $sum: '$amount' },
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

    const numberOfInvoices = Number(data[0]);
    const numberOfCustomers = Number(data[1]);
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

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const queryString = query;
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    /*
    The next MongoDB function should be equal to such query:
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
    */

    const invoices = await db.collection('invoices').aggregate([
      {
        '$lookup': {
          'from': 'customers', // Collection to join
          'localField': 'customer_id', // From invoices field
          'foreignField': 'id', // From customers field
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
          'customer_id',
          'department'
        ]
      }
    ]).limit(ITEMS_PER_PAGE).skip(offset).toArray();

    return JSON.parse(JSON.stringify(invoices));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch invoices!');
  }
};

export async function fetchInvoicesPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const count = await db.collection('invoices').aggregate([
      {
        '$lookup': {
          'from': 'customers', // Collection to join
          'localField': 'customer_id', // From invoices field
          'foreignField': 'id', // From customers field
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
            { amount: { query } },
            { date: { query } },
            { status: { query } }
          ]
        }
      },
      {
        $count: 'invoiceCount'
      },
    ]);
    /*
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;
    */
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch total number of invoices!');
  }
};

export async function fetchInvoiceById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // SELECT * FROM users WHERE email=${email}
    const data = await db.collection('invoices').find({ id }).toArray();

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch invoice!');
  }
};

export async function fetchCustomers() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // SELECT * FROM customers ORDER BY customers.name ASC
    const customers = await db.collection('customers').find({}).sort({ name: 1 }).toArray();
    return JSON.parse(JSON.stringify(customers));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch customers!');
  }
};

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch customer table!');
  }
}

export async function getUser(email: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // SELECT * FROM users WHERE email=${email}
    const user = await db.collection('users').findOne({ email });
    return JSON.parse(JSON.stringify(user));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get user!');
  }
}
