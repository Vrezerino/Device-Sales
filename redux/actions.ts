import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setDevices } from '@/redux/features/deviceSlice';
import {
    fetchDevices,
    fetchRevenue,
    postDevice,
    fetchFilteredInvoices,
    fetchFilteredCustomers
} from '@/app/lib/data';
import { setRevenue } from './features/revenueSlice';
import { setInvoices } from './features/invoiceSlice';
import { setCustomersWithInvoiceInfo } from './features/customerSlice';

const dispatch = useDispatch<AppDispatch>();

export const fetchAndSetDevices = async () => {
    const data = await fetchDevices();
    dispatch(setDevices(data));
};

export const fetchAndSetRevenue = async () => {
    const data = await fetchRevenue();
    dispatch(setRevenue(data));
};

export const fetchAndSetInvoices = async (query: string, currentPage: number) => {
    const data = await fetchFilteredInvoices(query, currentPage);
    dispatch(setInvoices(data));
};

export const fetchAndSetCustomersWithInvoiceInfo = async (query: string) => {
    const data = await fetchFilteredCustomers(query);
    dispatch(setCustomersWithInvoiceInfo(data));
};