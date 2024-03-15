'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    postInvoice,
    updateInvoice,
    deleteInvoice,
    postDevice,
    updateDevice,
    deleteDevice,
    postCustomer,
    updateCustomer,
} from './data';
import { ObjectId } from 'mongodb';

import { signIn } from '../auth';
import { AuthError } from 'next-auth';

import { store } from '@/redux/store';
import { addInvoice, editInvoice, removeInvoice } from '@/redux/features/invoiceSlice';
import { addDevice, editDevice, removeDevice } from '@/redux/features/deviceSlice';
import { addCustomer, editCustomer, removeCustomer } from '@/redux/features/customerSlice';

const DeviceFormSchema = z.object({
    id: z.string(),
    deviceName: z.string(),
    deviceNumber: z.string(),
    deviceDescription: z.string(),
    deviceManufacturer: z.string(),
    amount: z.coerce.number(),
    imageUrl: z.string()
});

const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CustomerFormSchema = z.object({
    //_id: z.string(),
    name: z.string(),
    email: z.string(),
    image_url: z.string(),
    company: z.string(),
});

const UserFormSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string()
});

///////////////////////////////////////
/////////// DEVICE ACTIONS ////////////
///////////////////////////////////////

const CreateDevice = DeviceFormSchema.omit({ id: true });

export async function createDevice(formData: FormData) {
    const { deviceName, deviceNumber, deviceManufacturer, deviceDescription, amount, imageUrl } = CreateDevice.parse({
        deviceName: formData.get('deviceName'),
        deviceNumber: formData.get('deviceNumber'),
        deviceManufacturer: formData.get('deviceManufacturer'),
        deviceDescription: formData.get('deviceDescription'),
        amount: formData.get('amount'),
        imageUrl: formData.get('imageUrl'),
    });

    const device = { deviceName, deviceNumber, deviceManufacturer, deviceDescription, amount, imageUrl };
    const response = await postDevice(device);
    if (response.acknowledged) {
        // Use store directly to dispatch if db query successful; can't use useDispatch within server code
        store.dispatch(addDevice(device));
        redirect('/dashboard/devices');
    }
};

// CreateDevice schema can be re-used.
export async function modifyDevice(id: string, formData: FormData) {
    const { deviceName, deviceNumber, deviceManufacturer, deviceDescription, amount, imageUrl } = CreateDevice.parse({
        deviceName: formData.get('deviceName'),
        deviceNumber: formData.get('deviceNumber'),
        deviceManufacturer: formData.get('deviceManufacturer'),
        deviceDescription: formData.get('deviceDescription'),
        amount: formData.get('amount'),
        imageUrl: formData.get('imageUrl'),
    });

    const device = { deviceName, deviceNumber, deviceManufacturer, deviceDescription, amount, imageUrl };
    const response = await updateDevice(id, device);
    if (response.acknowledged) {
        // Use store directly to dispatch if db query successful; can't use useDispatch within server code
        store.dispatch(editDevice(device));
        redirect('/dashboard/devices');
    }
};

export async function destroyDevice(id: string) {
    const response = await deleteDevice(id);
    if (response.acknowledged) {
        // Use store directly to dispatch if db query successful; can't use useDispatch within server code
        store.dispatch(removeDevice(id));
        redirect('/dashboard/devices');
    }
};

/////////////////////////////////////
////////// INVOICE ACTIONS //////////
/////////////////////////////////////

const CreateInvoice = InvoiceFormSchema.omit({ date: true, id: true });

export async function createInvoice(formData: FormData) {
    // Parse values from formData object
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    const invoice = { customerId, amountInCents, status, date };
    const response = await postInvoice(invoice);
    if (response.acknowledged) {
        // Use store directly to dispatch if db query successful; can't use useDispatch within server code
        store.dispatch(addInvoice(invoice));
        redirect('/dashboard/invoices');
    }
};

const UpdateInvoice = InvoiceFormSchema.omit({ date: true });

export async function modifyInvoice(id: string, formData: FormData) {
    // Parse values from formData object
    const { customerId, amount, status } = UpdateInvoice.parse({
        id: formData.get('id'),
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });
    const amountInCents = amount * 100;

    const invoice = { _id: id, customerId, amount: amountInCents, status };
    const response = await updateInvoice(id, invoice);
    if (response.acknowledged) {
        // Use store directly to dispatch if db query successful
        store.dispatch(editInvoice(invoice));
        redirect('/dashboard/invoices');
    }
};

export async function destroyInvoice(id: string) {
    const response = await deleteInvoice(id);
    if (response.acknowledged) {
        // Use store directly to dispatch if db query successful
        store.dispatch(removeInvoice(id));
        redirect('/dashboard/invoices');
    }
    return response;
};

//////////////////////////////////////
////////// CUSTOMER ACTIONS //////////
//////////////////////////////////////

const CreateCustomer = CustomerFormSchema;

export async function createCustomer(formData: FormData) {
    const { name, email, image_url, company } = CreateCustomer.parse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('imageUrl'),
        company: formData.get('company')
    });

    const customer = { name, email, image_url, company };
    const response = await postCustomer(customer);
    if (response.acknowledged) {
        // Use store directly to dispatch if db query successful
        store.dispatch(addCustomer(customer));
        redirect('/dashboard/customers');
    }
};

// CreateCustomer schema can be re-used.
export async function modifyCustomer(_id: string, formData: FormData) { // "updateCustomer" already in actions.ts
    const { name, email, image_url, company } = CreateCustomer.parse({
        _id: formData.get('_id'),
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('imageUrl'),
        company: formData.get('company')
    });
    const objectId = new ObjectId(_id);

    const customer = { _id: objectId, name, email, image_url, company };
    const response = await updateCustomer(_id, customer);
    if (response.acknowledged) {
        // Use store directly to dispatch if db query successful
        store.dispatch(editCustomer(customer));
        redirect('/dashboard/customers');
    }
};

//////////////////////////////////////
////////// USER ACTIONS //////////////
//////////////////////////////////////

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
};