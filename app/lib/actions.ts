'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { postInvoice, deleteInvoice, postDevice, deleteDevice } from './data';

const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const DeviceFormSchema = z.object({
    id: z.string(),
    deviceName: z.string(),
    deviceNumber: z.string(),
    deviceDescription: z.string(),
    deviceManufacturer: z.string(),
    amount: z.number(),
    imageUrl: z.string()
});

const CustomerFormSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image_url: z.string(),
    department: z.string(),
});

const UserFormSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string()
});

const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

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
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function destroyInvoice(id: string) {
    await deleteInvoice(id);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');
}

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
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/devices');
    redirect('/dashboard/devices');
}

export async function destroyDevice(number: string) {
    await deleteDevice(number);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/devices');
}