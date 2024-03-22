import { deviceReducer } from '../setup';
import { DeviceState, addDevice, removeDevice } from '@/redux/features/deviceSlice';
import { expect } from 'vitest';

describe('Device reducer', () => {
    it('should return initial state', () => {
        expect(deviceReducer(undefined, { type: 'unknown' })).toEqual({
            deviceList: []
        });
    });

    it('should handle a device being added to an empty list', () => {
        const newDevice = {
            _id: 'test',
            deviceName: 'test',
            deviceDescription: 'test',
            deviceManufacturer: 'test',
            deviceNumber: 'test',
            imageUrl: 'test',
            amount: 1
        };

        const previousState: DeviceState = {
            deviceList: []
        };

        expect(deviceReducer(previousState, addDevice(newDevice))).toEqual(
            {
                deviceList: [{
                    _id: 'test',
                    deviceName: 'test',
                    deviceDescription: 'test',
                    deviceManufacturer: 'test',
                    deviceNumber: 'test',
                    imageUrl: 'test',
                    amount: 1
                }]
            }
        );
    });


    it('should handle a device being added to an existing list', () => {
        const previousState: DeviceState = {
            deviceList: [{
                _id: 'test1',
                deviceName: 'test1',
                deviceDescription: 'test1',
                deviceManufacturer: 'test1',
                deviceNumber: 'test1',
                imageUrl: 'test1',
                amount: 1
            }]
        };

        const newDevice = {
            _id: 'test2',
            deviceName: 'test2',
            deviceDescription: 'test2',
            deviceManufacturer: 'test2',
            deviceNumber: 'test2',
            imageUrl: 'test2',
            amount: 1
        };

        expect(deviceReducer(previousState, addDevice(newDevice))).toEqual(
            {
                deviceList: [{
                    _id: 'test1',
                    deviceName: 'test1',
                    deviceDescription: 'test1',
                    deviceManufacturer: 'test1',
                    deviceNumber: 'test1',
                    imageUrl: 'test1',
                    amount: 1
                }, {
                    _id: 'test2',
                    deviceName: 'test2',
                    deviceDescription: 'test2',
                    deviceManufacturer: 'test2',
                    deviceNumber: 'test2',
                    imageUrl: 'test2',
                    amount: 1
                }]
            }
        );
    });

    it('should handle a device being removed by id', () => {
        const previousState: DeviceState = {
            deviceList: [{
                _id: 'test1',
                deviceName: 'test1',
                deviceDescription: 'test1',
                deviceManufacturer: 'test1',
                deviceNumber: 'test1',
                imageUrl: 'test1',
                amount: 1
            }]
        };

        expect(deviceReducer(previousState, removeDevice('test1'))).toEqual(
            {
                deviceList: []
            }
        );
    });
});