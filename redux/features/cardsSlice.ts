import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CardsData } from '@/app/lib/definitions';

export type CardsState = {
    cardsData: CardsData;
};

export const initialState: CardsState = {
    cardsData: {} as CardsData
}; 

export const cardsSlice = createSlice({
    name: 'cardsdata',
    initialState,
    reducers: {
        setCardsData: (state, action: PayloadAction<CardsData>) => {
            state.cardsData = action.payload;
        }
    },
});

export const { setCardsData } = cardsSlice.actions;
export default cardsSlice.reducer;