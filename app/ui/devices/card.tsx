'use client';

import { setDevices } from '@/redux/features/deviceSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';

import { getDeviceById } from '@/services/devices';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../skeletons';

const DeviceCard = ({ params }: { params: { id: string } }) => {
    const dispatch = useDispatch<AppDispatch>();
    const devices = useSelector(
        (state: RootState) => state.deviceReducer.deviceList
    );

    const device = devices.find((d) => d._id === params.id);

    /**
     * If device is not in store for example because you refreshed the single device view,
     * fetch the device by id and dispatch this single device to store
     */
    const fetchAndSetSingleDevice = async () => {
        if (!device) {
            const data = await getDeviceById(params.id);

            if (!data.error) {
                dispatch(setDevices([data]));
            } else {
                toast.error(data.error);
            }
        }
    };

    useEffect(() => {
        fetchAndSetSingleDevice();
    }, [])

    if (!device) return(<><CardSkeleton /></>)

    return (
        <div className='max-w-sm w-full lg:max-w-full lg:flex'>
            <div className='h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden' style={{ backgroundImage: `url(${device?.imageUrl})` }} title='Device image'>
            </div>
            <div className='border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal'>
                <div className='mb-8'>
                    <div className='text-gray-900 font-bold text-xl mb-2'>{device?.deviceName}</div>
                    <p className='text-gray-700 text-base'>
                        {device?.deviceDescription}
                    </p>
                </div>
                <div className='flex items-center'>
                    <div className='text-sm'>
                        <p className='text-gray-900 leading-none'>Manufacturer: {device?.deviceManufacturer}</p>
                        <p className='text-gray-600'>SNID: {device?.deviceNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default DeviceCard;