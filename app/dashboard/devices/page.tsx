import { fetchDevices } from "@/app/lib/data";
import { Device, Devices } from "@/app/lib/definitions";

export default async function Page() {
    const devices: Device[] = await fetchDevices();
    return (<>
        <p>Devices Page</p>
        {devices?.map((d: Device) => d.deviceName)}
    </>)
}