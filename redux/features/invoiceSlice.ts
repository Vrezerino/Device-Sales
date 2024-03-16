import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { InvoicesTable as InvoicesTableType } from '@/app/lib/definitions';

export type InvoiceState = {
    invoiceList: InvoicesTableType[];
};

export const initialState: InvoiceState = {
    invoiceList: [],
};

export const invoiceSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        setInvoices: (state, action: PayloadAction<InvoicesTableType[]>) => {
            state.invoiceList = action.payload;
        },
        addInvoice: (state, action) => {
            state.invoiceList.push(action.payload);
        },
        editInvoice: (state, action) => {
            state.invoiceList = state.invoiceList.map((invoice) => invoice._id === action.payload._id ? action.payload : invoice);
        },
        removeInvoice: (state, action) => {
            state.invoiceList = state.invoiceList.filter((invoice) => invoice._id !== action.payload);
        }
    },
});

export const { setInvoices, addInvoice, editInvoice, removeInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;