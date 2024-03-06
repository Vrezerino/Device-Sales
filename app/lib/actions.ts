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

    await postDevice({ deviceName, deviceNumber, deviceManufacturer, deviceDescription, amount, imageUrl });
    // Clear some caches and trigger a new request to the server.
    //revalidatePath('/dashboard');
    revalidatePath('/dashboard/devices');
    redirect('/dashboard/devices');
};

// CreateDevice schema can be re-used.
export async function modifyDevice(id: string, formData: FormData) { // "updateDevice" already in actions.ts
    const { deviceName, deviceNumber, deviceManufacturer, deviceDescription, amount, imageUrl } = CreateDevice.parse({
        deviceName: formData.get('deviceName'),
        deviceNumber: formData.get('deviceNumber'),
        deviceManufacturer: formData.get('deviceManufacturer'),
        deviceDescription: formData.get('deviceDescription'),
        amount: formData.get('amount'),
        imageUrl: formData.get('imageUrl'),
    });

    await updateDevice(id, { deviceName, deviceNumber, deviceManufacturer, deviceDescription, amount, imageUrl });
    // Clear some caches and trigger a new request to the server.
    //revalidatePath('/dashboard');
    revalidatePath('/dashboard/devices');
    redirect('/dashboard/devices');
};

export async function destroyDevice(id: string) {
    await deleteDevice(id);
    //revalidatePath('/dashboard');
    revalidatePath('/dashboard/devices');
};

/////////////////////////////////////
////////// INVOICE ACTIONS //////////
/////////////////////////////////////

const CreateInvoice = InvoiceFormSchema.omit({ date: true, id: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await postInvoice({ customerId, amountInCents, status, date });
    // Clear some caches and trigger a new request to the server.
    //revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
};

const UpdateInvoice = InvoiceFormSchema.omit({ date: true });

export async function modifyInvoice(id: string, formData: FormData) { // "updateInvoice" already in actions.ts
    const { customerId, amount, status } = UpdateInvoice.parse({
        id: formData.get('id'),
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });
    const amountInCents = amount * 100;

    await updateInvoice(id, { _id: id, customerId, amount: amountInCents, status });
    // Clear some caches and trigger a new request to the server.
    //revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
};

export async function destroyInvoice(id: string) {
    await deleteInvoice(id);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');
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

    await postCustomer({ name, email, image_url, company });
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
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

    await updateCustomer(_id, { _id: objectId, name, email, image_url, company });
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
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