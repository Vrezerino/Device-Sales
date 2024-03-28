'use server';

import { addInvoice, editInvoice, removeInvoice } from '@/redux/features/invoiceSlice';
import { store } from '@/redux/store';
import { deleteInvoice, postInvoice, updateInvoice } from '@/services/invoices';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Server-side actions and schema(s) for server-side validation.

const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

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
    if (response?.acknowledged) {
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
    if (response?.acknowledged) {
        // Use store directly to dispatch if db query successful
        store.dispatch(editInvoice(invoice));
        redirect('/dashboard/invoices');
    }
};

export async function destroyInvoice(id: string) {
    const response = await deleteInvoice(id);
    if (response?.acknowledged) {
        // Use store directly to dispatch if db query successful
        store.dispatch(removeInvoice(id));
        redirect('/dashboard/invoices');
    }
};