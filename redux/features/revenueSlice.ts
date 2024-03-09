import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Revenue } from '@/app/lib/definitions';

type RevenueState = {
    revenueList: Revenue[];
};

const initialState: RevenueState = {
    revenueList: [],
};

export const revenueSlice = createSlice({
    name: 'revenue',
    initialState,
    reducers: {
        setRevenue: (state, action: PayloadAction<Revenue[]>) => {
            state.revenueList = action.payload;
        }
    },
});

export const { setRevenue } = revenueSlice.actions;
export default revenueSlice.reducer;