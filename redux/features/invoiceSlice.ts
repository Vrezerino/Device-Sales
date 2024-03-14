import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { InvoicesTable as InvoicesTableType } from '@/app/lib/definitions';

export type invoiceState = {
    invoiceList: InvoicesTableType[];
};

export const initialState: invoiceState = {
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
        removeInvoice: (state, action) => {
            console.log(action.payload);
            state.invoiceList = state.invoiceList.filter((invoice) => invoice._id !== action.payload);
        }
    },
});

export const { setInvoices, addInvoice, removeInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;