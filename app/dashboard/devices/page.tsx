import { fetchDevices } from "@/app/lib/data";
import { Device, Devices } from "@/app/lib/definitions";
import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
    const devices: Device[] = await fetchDevices();
    return (
        <>
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Devices</h1>
            </div>
            {devices?.map((d: Device) => d.deviceName)}
        </>
    )
}