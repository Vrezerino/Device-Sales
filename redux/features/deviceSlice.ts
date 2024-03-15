import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DevicesTable } from '@/app/lib/definitions';

export type DeviceState = {
    deviceList: DevicesTable[];
};

export const initialState: DeviceState = {
    deviceList: [],
};

export const deviceSlice = createSlice({
    name: 'devices',
    initialState,
    reducers: {
        setDevices: (state, action: PayloadAction<DevicesTable[]>) => {
            state.deviceList = action.payload;
        },
        addDevice: (state, action) => {
            state.deviceList.push(action.payload);
        },
        editDevice: (state, action) => {
            state.deviceList = state.deviceList.map((device) => device._id === action.payload._id ? action.payload : device);
        },
        removeDevice: (state, action) => {
            state.deviceList = state.deviceList.filter((device) => device._id !== action.payload);
        }
    },
});

export const { setDevices, addDevice, editDevice, removeDevice } = deviceSlice.actions;
export default deviceSlice.reducer;