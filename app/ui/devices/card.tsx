import { DevicesTable } from '@/app/lib/definitions';

const DeviceCard = ({ device }: { device: DevicesTable }) => {
    return (
        <div className='max-w-sm w-full lg:max-w-full lg:flex'>
            <div className='h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden' style={{ backgroundImage: `url(${device.imageUrl})` }} title='Device image'>
            </div>
            <div className='border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal'>
                <div className='mb-8'>
                    <div className='text-gray-900 font-bold text-xl mb-2'>{device.deviceName}</div>
                    <p className='text-gray-700 text-base'>
                        {device.deviceDescription}
                    </p>
                </div>
                <div className='flex items-center'>
                    <div className='text-sm'>
                        <p className='text-gray-900 leading-none'>Manufacturer: {device.deviceManufacturer}</p>
                        <p className='text-gray-600'>SNID: {device.deviceNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default DeviceCard;