import { ObjectId } from "mongodb";
import { CustomerNoId, Device, NewInvoice, UpdatingInvoice } from "./definitions";

export const MAX_FILE_SIZE = 1000000;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Server-side validation functions

const validateEmail = (email: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const validateDevice = (formData: FormData) => {
  const deviceName = formData.get('deviceName');

  if (!deviceName || typeof deviceName !== 'string' || deviceName.toString().length < 5) {
    throw new Error('Device name must be over 5 characters.')
  }

  if (deviceName.toString().length > 50) {
    throw new Error('Device name must be under 50 characters.')
  }

  const deviceNumber = formData.get('deviceNumber'); // Serial number, so a string

  if (!deviceNumber || typeof deviceNumber !== 'string' || deviceNumber.toString().length < 1) {
    throw new Error('Device number is required.')
  }

  if (deviceNumber.toString().length > 50) {
    throw new Error('Device number must be under 50 characters.')
  }

  const deviceManufacturer = formData.get('deviceManufacturer');

  if (!deviceManufacturer || typeof deviceManufacturer !== 'string' || deviceManufacturer.toString().length < 1) {
    throw new Error('Device manufacturer is required.')
  }

  if (deviceManufacturer.toString().length > 50) {
    throw new Error('Device manufacturer name must be under 50 characters.')
  }

  const deviceDescription = formData.get('deviceDescription');

  if (!deviceDescription || typeof deviceDescription !== 'string' || deviceDescription.toString().length < 1) {
    throw new Error('Device description is required.')
  }

  if (deviceDescription.toString().length > 1000) {
    throw new Error('Device description must be under 1000 characters.')
  }

  const amount = Number(formData.get('amount'));

  if (!amount || typeof amount !== 'number' || Number(amount) < 0) {
    throw new Error('Device amount is required and must be over 0.')
  }

  // Assign file to a key so we can unset it if needed
  const obj = { file: formData.get('image') };

  // If file was uploaded at all, check its validity
  if (obj.file instanceof File && obj.file !== null && obj.file !== undefined && obj.file.size > 0) {

    if (!ACCEPTED_IMAGE_TYPES.includes(obj.file.type)) throw new Error('File is not of accepted type! JPG/PNG/WEBP only.');

    if (obj.file.size >= MAX_FILE_SIZE) throw new Error('Image must be under 1MB in size!');

    // It is optional to upload an image file; unset the file key if file not uploaded
  } else if (obj.file instanceof File && obj.file !== null && obj.file !== undefined && obj.file.size === 0) {
    obj.file = null;
  } else {
    obj.file = null;
    throw new Error('Wrong type of file!');
  }

  const device: Device = { deviceName, deviceNumber, deviceManufacturer, deviceDescription, amount, image: obj.file };
  return device;
};

export const validateCustomer = (formData: FormData) => {
  const name = formData.get('name');

  if (!name || typeof name !== 'string' || name.toString().length < 5) {
    throw new Error('Customer name must be over 5 characters.')
  }

  if (name.toString().length > 50) {
    throw new Error('Customer name must be under 50 characters.')
  }

  const email = formData.get('email');

  if (!email || typeof email !== 'string' || email.toString().length < 1) {
    throw new Error('Email address is required.')
  }

  if (!validateEmail(email)) throw new Error('Invalid email address.')

  const company = formData.get('company');

  if (!company || typeof company !== 'string' || company.toString().length < 1) {
    throw new Error('Customer company is required.')
  }

  if (company.toString().length > 50) {
    throw new Error('Customer name must be under 50 characters.')
  }

  // Assign file to a key so we can unset it if needed
  const obj = { file: formData.get('image') };

  // If file was uploaded at all, check its validity
  if (obj.file instanceof File && obj.file !== null && obj.file !== undefined && obj.file.size > 0) {
    if (!ACCEPTED_IMAGE_TYPES.includes(obj.file.type)) throw new Error('File is not of accepted type! JPG/PNG/WEBP only.');
    if (obj.file.size >= MAX_FILE_SIZE) throw new Error('Image must be under 1MB in size!');

    // It is optional to upload an image file; unset the file key if file not uploaded
  } else if (obj.file instanceof File && obj.file !== null && obj.file !== undefined && obj.file.size === 0) {
    obj.file = null;
  } else {
    obj.file = null;
    throw new Error('Wrong type of file!');
  }

  const newCustomer: CustomerNoId = { name, email, company, image: obj.file };
  return newCustomer;
};

export const validateInvoice = (formData: FormData) => {
  // If new invoice, id is null
  const id = formData.get('id');
  if (id && typeof id !== 'string') throw new Error('Invalid ID.')

  const customerId = formData.get('customerId');

  if (!customerId) throw new Error('Invoice needs a customer.')
  if ((typeof customerId !== 'string')) throw new Error('Customer ID is invalid (not a string).');

  const amount = formData.get('amount');
  if (!(amount)) throw new Error('Amount needs to be a number.')

  const amountStr = amount.toString();
  const amountNumber = parseFloat(amountStr);

  if (amountNumber < 0) throw new Error(`Amount can't be negative.`);
  if (amountNumber > 1000000000) throw new Error(`Let's be real, we're not billing anyone over 1 billion.`)

  const amountInCents = amountNumber * 100;
  const date = new Date().toISOString().split('T')[0];

  const status = formData.get('status');
  if (!(status)) throw new Error('Invoice has to have status (paid/pending)!');

  if (status !== 'paid' && status !== 'pending') {
    throw new Error('Status must be either "paid" or "pending"!');
  }

  if (!id) {
    const newInvoice: NewInvoice = { customerId, amountInCents, date, status };
    return newInvoice;
  } else {
    const modifiedInvoice: UpdatingInvoice = { id, customerId, amountInCents, status };
    return modifiedInvoice;
  }
}