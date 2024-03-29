'use server';

import { store } from '@/redux/store';
import { deleteCustomer, postCustomer, updateCustomer } from '@/services/customers';
import { addCustomer, editCustomer, removeCustomer } from '@/redux/features/customerSlice';
import { validateCustomer } from '../validations';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Server-side actions and validations.

export async function createCustomer(formData: FormData) {
    const customer = validateCustomer(formData);
    const savedCustomer = await postCustomer(customer);

    store.dispatch(addCustomer(savedCustomer));
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');

};

export async function modifyCustomer(_id: string, formData: FormData) {
    const customer = validateCustomer(formData);
    const response = await updateCustomer(_id, customer);

    if (response?.acknowledged) {
        store.dispatch(editCustomer(customer));
        revalidatePath('/dashboard/customers');
        redirect('/dashboard/customers');
    }
};

export async function destroyCustomer(id: string) {
    const response = await deleteCustomer(id);
    
    if (response?.acknowledged) {
        store.dispatch(removeCustomer(id));
        revalidatePath('/dashboard/customers');
        redirect('/dashboard/customers');
    }
};