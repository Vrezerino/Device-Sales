'use server';

import { Device } from '@/app/lib/definitions';
import { DB_NAME, clientPromise } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export const fetchDevices = async () => {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
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
  
  export async function postDevice(device: Device) {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
  
      const result = await db.collection('devices').insertOne(device);
      return result;
    } catch (e) {
      console.error(e);
      throw new Error('Failed to insert new device!');
    }
  };
  
  export async function updateDevice(id: string, device: Device) {
    try {
      const _id = new ObjectId(id);
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const result = await db.collection('devices').updateOne({ _id }, {
        $set: {
          deviceName: device.deviceName,
          deviceManufacturer: device.deviceManufacturer,
          deviceDescription: device.deviceDescription,
          amount: device.amount,
          imageUrl: device.imageUrl
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
  
      const result = await db.collection('devices').deleteOne({ _id });
      return result;
    } catch (e) {
      console.error(e);
      throw new Error('Failed to delete device!');
    }
  };