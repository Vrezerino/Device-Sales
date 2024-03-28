'use server';

import { store } from '@/redux/store';
import { deleteCustomer, postCustomer, updateCustomer } from '@/services/customers';
import { addCustomer, editCustomer, removeCustomer } from '@/redux/features/customerSlice';
import { validateCustomer } from '../utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Server-side actions and schema(s) for server-side validation.

export async function createCustomer(formData: FormData) {
    const customer = validateCustomer(formData);
    const response = await postCustomer(customer);
    if (response?.acknowledged) {
        // Use store directly to dispatch if db query successful
        store.dispatch(addCustomer(customer));
        revalidatePath('/dashboard/customers');
        redirect('/dashboard/customers');
    }
};

export async function modifyCustomer(_id: string, formData: FormData) {
    const customer = validateCustomer(formData);
    const response = await updateCustomer(_id, customer);
    if (response?.acknowledged) {
        // Use store directly to dispatch if db query successful
        store.dispatch(editCustomer(customer));
        revalidatePath('/dashboard/customers');
        redirect('/dashboard/customers');
    }
};

export async function destroyCustomer(id: string) {
    const response = await deleteCustomer(id);
    if (response?.acknowledged) {
        // Use store directly to dispatch if db query successful
        store.dispatch(removeCustomer(id));
        revalidatePath('/dashboard/customers');
        redirect('/dashboard/customers');
    }
};