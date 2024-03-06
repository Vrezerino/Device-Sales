import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setDevices } from '@/redux/features/deviceSlice';
import { fetchDevices } from '@/app/lib/data';

const dispatch = useDispatch<AppDispatch>();

export const fetchAndSetDevices = async () => {
    const data = await fetchDevices();
    dispatch(setDevices(data));
};