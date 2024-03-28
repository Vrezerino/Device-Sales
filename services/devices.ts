'use server';

import path from 'path';
import { unlink, writeFile } from 'fs/promises';

import { Device } from '@/app/lib/definitions';
import { DB_NAME, clientPromise } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

const dir = '/img/devices/';

export const fetchDevices = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Return devices sorted by their names, descending
    const devices = await db.collection('devices').find({}).sort({ deviceName: -1 }).toArray();
    return JSON.parse(JSON.stringify(devices));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch devices!');
  }
};

export async function getDeviceById(id: string) {
  try {
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const device = await db.collection('devices').findOne({ _id });
    return JSON.parse(JSON.stringify(device));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch device!');
  }
};

export const postDevice = async (device: Device) => {
  // Image uploading is optional so image could be null
  const file = device.image || null;

  // Create a byte array from file
  const buffer = device.image && Buffer.from(await file?.arrayBuffer());

  /*
    Create filename from device name replacing possible spaces with underscores, add period,
    add file extension. If no file was uploaded, filename refers to a fallback/generic device image.
  */
  const filename = file ? `${device.deviceName.replaceAll(' ', '_')}.${file.type.split('/')[1]}` : '___blankDevice.jpg';

  /*
    Devices do not get inserted into db with the file blob.
    They'll contain a URL to the file instead and the file
    itself is uploaded on /public/img/devices.
  */
  const newDevice = { ...device, imageUrl: dir + filename };
  delete newDevice.image;

  try {
    // Write file to /public/img/devices/filename
    if (device.image) {
      await writeFile(
        path.join(process.cwd(), 'public' + dir + filename),
        buffer
      );
    }
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection('devices').insertOne(newDevice);
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to insert new device!');
  }
};

export async function updateDevice(id: string, device: Device) {
  const file = device.image || null;

  // Create a byte array from file
  const buffer = Buffer.from(await file?.arrayBuffer());

  /*
    Create filename from device name replacing possible spaces with underscores, add period,
    add file extension. If no file was uploaded, filename refers to a fallback/generic device image.
  */
  const filename = file ? `${device.deviceName.replaceAll(' ', '_')}.${file.type.split('/')[1]}` : '___blankDevice.jpg';

  try {
    // Write file to /public/img/devices/filename
    if (device.image) {
      await writeFile(
        path.join(process.cwd(), 'public' + dir + filename),
        buffer
      );
    }
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db.collection('devices').updateOne({ _id }, {
      $set: {
        deviceName: device.deviceName,
        deviceManufacturer: device.deviceManufacturer,
        deviceDescription: device.deviceDescription,
        amount: device.amount,
        imageUrl: dir + filename
      }
    });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to update device!');
  }
};

export async function deleteDevice(id: string) {
  try {
    const _id = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Retrieve the device image filename for image deletion
    const device = await db.collection('devices').findOne({ _id });

    // Remove device from database
    const result = await db.collection('devices').deleteOne({ _id });

    // Delete device image file from server only if it's not the generic image
    if (!device?.imageUrl.includes('___blankDevice')) {
      unlink(path.join(process.cwd(), 'public' + device?.imageUrl));
    }
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to delete device!');
  }
};