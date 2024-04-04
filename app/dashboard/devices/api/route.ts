import { setDevices } from '@/redux/features/deviceSlice';
import { store } from '@/redux/store';
import { fetchDevices } from '@/services/devices';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export const GET = async () => {
    const response = await fetchDevices();
    if (!response.error) {
        console.log(response);
        store.dispatch(setDevices(response));
        return new Response('', { status: 200 });
    } else {
        console.log('error');
        return new Response(response.error, response.error.code);
    }
}