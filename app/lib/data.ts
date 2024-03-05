import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  Invoice,
  NewInvoice,
  Device,
  Customer,
} from './definitions';
import {
  users,
  customers,
  invoices,
  revenue,
  devices
} from './placeholder-data';
import { formatCurrency, monthOrder } from './utils';

//import { GetStaticProps } from 'next';
import { Devices } from './definitions';
import { clientPromise, DB_NAME } from './mongodb';
import { ObjectId } from 'mongodb';

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

////////////////////////////////////////////
/////////// DEVICE CRUD METHODS ////////////
////////////////////////////////////////////

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

export async function getDeviceById(id: string) {
  try {
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const device = await db.collection('devices').findOne({ _id });
    return JSON.parse(JSON.stringify(device));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch device!');
  }
};

export async function postDevice(device: Device) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('devices').insertOne(device);
    //return res.status(201).send('Created');
  } catch (e) {
    console.error(e);
    throw new Error('Failed to insert new device!');
  }
};

export async function deleteDevice(id: string) {
  try {
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('devices').deleteOne({ _id });
  } catch (e) {
    console.error(e);
    throw new Error('Failed to delete device!');
  }
};

/////////////////////////////////////
////////// INVOICE METHODS //////////
/////////////////////////////////////

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

    const invoices = await db.collection('invoices').aggregate([
      {
        '$lookup': {
          'from': 'customers', // Collection to join
          'localField': 'customerId', // From invoices field
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
          'id',
          'customerId',
          'department'
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
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const count = await db.collection('invoices').aggregate([
      {
        '$lookup': {
          'from': 'customers', // Collection to join
          'localField': 'customerId', // From invoices field
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
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const invoice = await db.collection('invoices').findOne({ _id });
    return JSON.parse(JSON.stringify(invoice));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch invoice!');
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
          'localField': 'customerId', // From invoices field
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
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('invoices').insertOne(invoice);
    //return res.status(201).send('Created');
  } catch (e) {
    console.error(e);
    throw new Error('Failed to insert new invoice!');
  }
};

export async function deleteInvoice(id: string) {
  try {
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('invoices').deleteOne({ _id });
  } catch (e) {
    console.error(e);
    throw new Error('Failed to delete invoice!');
  }
};

//////////////////////////////////////
////////// CUSTOMER METHODS //////////
//////////////////////////////////////

export async function getCustomer(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // SELECT * FROM users WHERE email=${email}
    const customer = await db.collection('customers').findOne({ id });
    return JSON.parse(JSON.stringify(customer));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get customer!');
  }
};

export async function createCustomer(customer: Customer) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('customers').insertOne(customer);
    //return res.status(201).send('Created');
  } catch (e) {
    console.error(e);
    throw new Error('Failed to create customer!');
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
};

//////////////////////////////////
////////// CARD METHODS //////////
//////////////////////////////////

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

//////////////////////////////////
////////// USER METHODS //////////
//////////////////////////////////

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
};

export async function createUser(user: User) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('users').insertOne(user);
    //return res.status(201).send('Created');
  } catch (e) {
    console.error(e);
    throw new Error('Failed to create user!');
  }
};

/////////////////////////////////////
////////// REVENUE METHODS //////////
/////////////////////////////////////

export const fetchRevenue = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const revenue = await db.collection('revenue').find({}).toArray();
    const parsedAndStringifiedRevenue: Revenue[] = JSON.parse(JSON.stringify(revenue));

    const revebueSortedByMonth = parsedAndStringifiedRevenue.sort((a, b) => {
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    return revebueSortedByMonth;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch customer revenue!');
  }
};
