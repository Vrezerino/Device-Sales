import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setDevices } from '@/redux/features/deviceSlice';
import { fetchDevices, fetchRevenue, postDevice } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { setRevenue } from './features/revenueSlice';

const dispatch = useDispatch<AppDispatch>();

export const fetchAndSetDevices = async () => {
    const data = await fetchDevices();
    dispatch(setDevices(data));
};

export const fetchAndSetRevenue = async () => {
    const data = await fetchRevenue();
    dispatch(setRevenue(data));
};

/* kirjoita tämä
export const createDevice = async (formData: FormData) => {
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
    revalidatePath('/dashboard/devices');
    revalidatePath('/dashboard');
    redirect('/dashboard/devices');
};
*/