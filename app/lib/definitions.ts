import { ObjectId } from 'mongodb';


export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// For new devices with possible image file blob
export type Device = {
  deviceName: string;
  deviceManufacturer: string;
  deviceNumber: string;
  image: any;
  deviceDescription: string;
  amount: number
}

export interface Devices {
  devices: Device[];
}

// Devices with urls pointing to the image files on the server (not database)
export type DevicesTable = {
  _id: string;
  deviceName: string;
  deviceDescription: string;
  deviceManufacturer: string;
  deviceNumber: string;
  imageUrl: string;
  amount: number;
};

export type Invoice = {
  id: string;
  customerId: string;
  amountInCents: number;
  date: string;
  status: 'pending' | 'paid';
};

export type NewInvoice = Omit<Invoice, 'id'>;
export type UpdatingInvoice = Omit<Invoice, 'date'>;

export type InvoiceForm = {
  _id: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amountInCents: string;
};

// Returns a number for amount, but we later format it to a string with the formatCurrency function
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

// For new customers with possible image file blob
export type Customer = {
  _id: ObjectId;
  name: string;
  email: string;
  image: any;
  company: string;
};

export type CustomerNoId = Omit<Customer, '_id'>;

// Customers with urls pointing to the image files on the server (not database)
export type CustomersTableType = {
  _id: string;
  name: string;
  email: string;
  image_url: string;
  company: string;
  totalInvoices: number;
  totalPending: number;
  totalPaid: number;
};

export type CustomerField = {
  _id: string;
  name: string;
};

export type ConnectionStatus = {
  isConnected: boolean;
};

export type Revenue = {
  month: string;
  revenue: number;
};