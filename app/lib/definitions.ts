// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Device = {
  deviceName: string;
  deviceManufacturer: string;
  deviceNumber: string;
  imageUrl: string;
  deviceDescription: string;
  amount: number
}

export interface Devices {
  devices: Device[];
}

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  department: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
};

export type NewInvoice = {
  customerId: string,
  amountInCents: number,
  status: string,
  date: string
}

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amountInCents: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  _id: string;
  customerId: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amountInCents: number;
  status: 'pending' | 'paid';
};

export type DevicesTable = {
  id: string;
  deviceName: string;
  deviceManufacturer: string;
  deviceNumber: string;
  imageUrl: string;
  amount: number;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  _id: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type ConnectionStatus = {
  isConnected: boolean;
};