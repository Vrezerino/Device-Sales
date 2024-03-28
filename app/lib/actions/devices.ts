'use server';

import { store } from '@/redux/store';
import { addDevice, editDevice, removeDevice } from '@/redux/features/deviceSlice';
import { deleteDevice, postDevice, updateDevice } from '@/services/devices';
import { validateDevice } from '../utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Server-side actions and schema(s) for server-side validation.

export async function createDevice(formData: FormData) {
    const device = validateDevice(formData);
    const response = await postDevice(device);
    if (response?.acknowledged) {
        // Use store directly to dispatch if db query successful; can't use useDispatch within server code
        store.dispatch(addDevice(device));
        revalidatePath('/dashboard/devicess');
        redirect('/dashboard/devices');
    }
};

export async function modifyDevice(id: string, formData: FormData) {
    const device = validateDevice(formData);
    const response = await updateDevice(id, device);
    if (response?.acknowledged) {
        // Use store directly to dispatch if db query successful; can't use useDispatch within server code
        store.dispatch(editDevice(device));
        redirect('/dashboard/devices');
    }
};

export async function destroyDevice(id: string) {
    const response = await deleteDevice(id);
    if (response?.acknowledged) {
        // Use store directly to dispatch if db query successful; can't use useDispatch within server code
        store.dispatch(removeDevice(id));
        redirect('/dashboard/devices');
    }
};