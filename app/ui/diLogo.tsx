import { TvIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function DeviceLogo() {
  return (
    <div className='logoContainer'>
      <div
        className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
      >
        <TvIcon className="h-12 w-12" />
        <p className="text-[33px] text-white">Device Sales</p>
      </div>
    </div>
  );
};