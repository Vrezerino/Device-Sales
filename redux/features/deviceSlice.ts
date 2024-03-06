import { createSlice } from '@reduxjs/toolkit';
import { DevicesTable } from '@/app/lib/definitions';

type DeviceState = {
    deviceList: DevicesTable[];
};

const initialState: DeviceState = {
    deviceList: [],
};

export const deviceSlice = createSlice({
    name: 'devices',
    initialState,
    reducers: {
        setDevices: (state, action) => {
            state.deviceList = action.payload;
        },
        addDevice: (state, action) => {
            state.deviceList.push(action.payload);
        },
        removeDevice: (state, action) => {
            state.deviceList = state.deviceList.filter((device) => device._id !== action.payload);
        }
    },
});

export const { setDevices, addDevice, removeDevice } = deviceSlice.actions;
export default deviceSlice.reducer;

