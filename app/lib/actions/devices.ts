'use server';

import { store } from '@/redux/store';
import { addDevice, editDevice, removeDevice } from '@/redux/features/deviceSlice';
import { deleteDevice, postDevice, updateDevice } from '@/services/devices';
import { validateDevice } from '../validations';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Server-side actions and validations.

export async function createDevice(formData: FormData) {
    const device = validateDevice(formData);
    const savedDevice = await postDevice(device);

    store.dispatch(addDevice(savedDevice));
    revalidatePath('/dashboard/devicess');
    redirect('/dashboard/devices');

};

export async function modifyDevice(id: string, formData: FormData) {
    const device = validateDevice(formData);
    const response = await updateDevice(id, device);

    if (response?.acknowledged) {
        store.dispatch(editDevice(device));
        revalidatePath('/dashboard/devicess');
        redirect('/dashboard/devices');
    }
};

export async function destroyDevice(id: string) {
    const response = await deleteDevice(id);

    if (response?.acknowledged) {
        store.dispatch(removeDevice(id));
        redirect('/dashboard/devices');
    }
};